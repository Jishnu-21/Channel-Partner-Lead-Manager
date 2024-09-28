import React, { useState, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from '../components/InternalUser/Sidebar';
import Dashboard from '../components/InternalUser/Dashboard';
import PaymentDashboard from '../components/InternalUser/PaymentDashboard';
import DataManagement from '../components/InternalUser/DataManagement';
import { API_URL } from '../config';
import { toast } from 'sonner';

const BackendPanel = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filter, setFilter] = useState({
    channelPartnerCode: '',
    leadSource: '',
    leadInterest: '',
    timeframe: ''
  });
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [channelPartners, setChannelPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [leadsResponse, partnersResponse] = await Promise.all([
          fetch(`${API_URL}/leads`),
        ]);
        
        if (!leadsResponse.ok) throw new Error('Failed to fetch leads');
        if (!partnersResponse.ok) throw new Error('Failed to fetch channel partners');

        const leadsData = await leadsResponse.json();
        const partnersData = await partnersResponse.json();

        setLeads(leadsData);
        setFilteredLeads(leadsData);
        setChannelPartners(partnersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value
    }));
  };

  const applyFilters = (customFilter = filter) => {
    if (!Array.isArray(leads)) {
      console.error('Leads is not an array:', leads);
      return;
    }

    const filtered = leads.filter(lead => {
      const date = new Date(lead.date);
      const currentDate = new Date();
      
      const timeframeCondition = customFilter.timeframe ? 
        (customFilter.timeframe === 'daily' ? date.toDateString() === currentDate.toDateString() :
        customFilter.timeframe === 'weekly' ? 
          (currentDate.getTime() - date.getTime()) / (1000 * 3600 * 24) <= 7 :
        customFilter.timeframe === 'monthly' ? date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear() : true) 
      : true;

      return (
        (customFilter.channelPartnerCode === '' || lead.channelPartnerCode === customFilter.channelPartnerCode) &&
        (customFilter.leadSource === '' || lead.leadSource === customFilter.leadSource) &&
        (customFilter.leadInterest === '' || lead.leadInterest === customFilter.leadInterest) &&
        timeframeCondition
      );
    });
    setFilteredLeads(filtered);
  };

  const resetFilter = () => {
    setFilter({
      channelPartnerCode: '',
      leadSource: '',
      leadInterest: '',
      timeframe: ''
    });
    setFilteredLeads(leads);
    setSelectedPartners([]); 
  };

  const handlePartnerChange = (event) => {
    const value = event.target.value;
    setSelectedPartners(value === "" ? [] : value);
  };

  const selectedLeads = selectedPartners.length > 0
    ? filteredLeads.filter(lead => selectedPartners.includes(lead.channelPartnerCode))
    : filteredLeads;

  const uniquePartners = channelPartners.map(partner => partner.channelPartnerCode);

  useEffect(() => {
    if (leads.length > 0) {
      applyFilters();
    }
  }, [filter, leads]);

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar 
        drawerOpen={drawerOpen} 
        setDrawerOpen={setDrawerOpen} 
        setActiveView={setActiveView} 
        resetFilter={resetFilter}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {activeView === 'dashboard' && (
          <Dashboard 
            selectedLeads={selectedLeads} 
            uniquePartners={uniquePartners} 
            selectedPartners={selectedPartners} 
            handlePartnerChange={handlePartnerChange} 
            filter={filter}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            filteredLeads={filteredLeads}
          />
        )}
        {activeView === 'paymentdashboard' && (
          <PaymentDashboard 
            selectedLeads={selectedLeads}
            uniquePartners={uniquePartners}
          />
        )}
        {activeView === 'datamanagement' && (
          <DataManagement 
            leads={leads}
            filteredLeads={filteredLeads}
            setFilteredLeads={setFilteredLeads}
            filter={filter}
            setFilter={setFilter}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            resetFilter={resetFilter}
          />
        )}
      </Box>
    </Box>
  );
};

export default BackendPanel;
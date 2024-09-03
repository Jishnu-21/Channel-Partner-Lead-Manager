import React, { useState, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from '../components/InternalUser/Sidebar';
import Dashboard from '../components/InternalUser/Dashboard';
import DataManagement from '../components/InternalUser/DataManagement';
import { API_URL } from '../config';

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

  useEffect(() => {
    const fetchLeads = async () => {
      const response = await fetch(`${API_URL}/leads`);
      const data = await response.json();
      setLeads(data);
      setFilteredLeads(data);
    };
    fetchLeads();
  }, []);

  useEffect(() => {
    const fetchChannelPartners = async () => {
      const response = await fetch(`${API_URL}/users/channel-partners`);
      const data = await response.json();
      setChannelPartners(data);
    };
    fetchChannelPartners();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value
    }));
  };

  const applyFilters = () => {
    const filtered = leads.filter(lead => {
      const date = new Date(lead.date);
      const currentDate = new Date();
      
      const timeframeCondition = filter.timeframe ? 
        (filter.timeframe === 'daily' ? date.toDateString() === currentDate.toDateString() :
        filter.timeframe === 'weekly' ? 
          (currentDate.getTime() - date.getTime()) / (1000 * 3600 * 24) <= 7 :
        filter.timeframe === 'monthly' ? date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear() : true) 
      : true;

      return (
        (filter.channelPartnerCode === '' || lead.channelPartnerCode === filter.channelPartnerCode) &&
        (filter.leadSource === '' || lead.leadSource === filter.leadSource) &&
        (filter.leadInterest === '' || lead.leadInterest === filter.leadInterest) &&
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
  
    if (value === "") {
      setSelectedPartners([]); // Reset to default state when "All Partners" is selected
      // You can also reset any other states here as needed
    } else {
      setSelectedPartners(value);
    }
  };
  

  const selectedLeads = selectedPartners.length > 0
    ? filteredLeads.filter(lead => selectedPartners.includes(lead.channelPartnerCode))
    : filteredLeads;

  const uniquePartners = channelPartners.map(partner => partner.channelPartnerCode);

  useEffect(() => {
    applyFilters();
  }, [filter, leads]);

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
        {activeView === 'dashboard' 
          ? <Dashboard 
              selectedLeads={selectedLeads} 
              uniquePartners={uniquePartners} 
              selectedPartners={selectedPartners} 
              handlePartnerChange={handlePartnerChange} 
              filter={filter}
              handleFilterChange={handleFilterChange}
              applyFilters={applyFilters}
              filteredLeads={filteredLeads} // Pass filteredLeads here
            />
          : <DataManagement 
              filter={filter} 
              handleFilterChange={handleFilterChange} 
              applyFilters={applyFilters} 
              filteredLeads={filteredLeads} 
              resetFilter={resetFilter} 
            />
        }
      </Box>
    </Box>
  );
};

export default BackendPanel;

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
  const [selectedPartner, setSelectedPartner] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [channelPartners, setChannelPartners] = useState([]); // New state for channel partners

  // Fetch leads from the API
  useEffect(() => {
    const fetchLeads = async () => {
      const response = await fetch(`${API_URL}/leads`);
      const data = await response.json();
      setLeads(data);
      setFilteredLeads(data); // Set initial filtered leads to all leads
    };
    fetchLeads();
  }, []);

  // Fetch channel partners from the API
  useEffect(() => {
    const fetchChannelPartners = async () => {
      const response = await fetch(`${API_URL}/users/channel-partners`);
      const data = await response.json();
      setChannelPartners(data); 
    };
    fetchChannelPartners();
  }, []);

  // Handle changes in filter input fields
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prevFilter => ({
      ...prevFilter,
      [name]: value
    }));
  };

  // Apply filters to the leads
  const applyFilters = () => {
    const filtered = leads.filter(lead => {
      const date = new Date(lead.date); // Assuming 'date' is a field in lead data
      const currentDate = new Date();
      
      // Determine timeframe condition
      const timeframeCondition = filter.timeframe ? 
        (filter.timeframe === 'daily' ? date.toDateString() === currentDate.toDateString() :
        filter.timeframe === 'weekly' ? 
          (date.getTime() - currentDate.getTime()) / (1000 * 3600 * 24) <= 7 :
        filter.timeframe === 'monthly' ? date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear() : true) 
      : true;

      // Return true if lead matches all filter criteria
      return (
        (filter.channelPartnerCode === '' || lead.channelPartnerCode === filter.channelPartnerCode) &&
        (filter.leadSource === '' || lead.leadSource === filter.leadSource) &&
        (filter.leadInterest === '' || lead.leadInterest === filter.leadInterest) &&
        timeframeCondition
      );
    });
    setFilteredLeads(filtered);
  };

  // Reset filters to default state
  const resetFilter = () => {
    setFilter({
      channelPartnerCode: '',
      leadSource: '',
      leadInterest: '',
      timeframe: ''
    });
    setFilteredLeads(leads); // Reset filtered leads to original leads
  };

  // Handle changes to the selected partner
  const handlePartnerChange = (event) => {
    setSelectedPartner(event.target.value);
  };

  // Get selected leads based on the chosen partner
  const selectedLeads = selectedPartner 
    ? filteredLeads.filter(lead => lead.channelPartnerCode === selectedPartner)
    : filteredLeads;

  // Extract unique channel partners from the fetched data
  const uniquePartners = channelPartners.map(partner => partner.channelPartnerCode);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar 
        drawerOpen={drawerOpen} 
        setDrawerOpen={setDrawerOpen} 
        setActiveView={setActiveView} 
        resetFilter={resetFilter} // Pass reset function to Sidebar
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {activeView === 'dashboard' 
          ? <Dashboard 
              selectedLeads={selectedLeads} 
              uniquePartners={uniquePartners} 
              selectedPartner={selectedPartner} 
              handlePartnerChange={handlePartnerChange} 
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

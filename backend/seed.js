const mongoose = require('mongoose');
const Lead = require('./models/Lead'); // Adjust the path to your Lead model
const dotenv = require('dotenv');

dotenv.config();



mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const seedLeads = async () => {
  const leads = [
    {
      channelPartnerCode: 'CP001',
      leadName: 'John Doe',
      contactNumber: '1234567890',
      email: 'john.doe@example.com',
      leadSource: 'Social Media',
      leadInterest: 'Product A',
      additionalNotes: 'Interested in a demo',
    },
    {
      channelPartnerCode: 'CP001',
      leadName: 'Jane Smith',
      contactNumber: '0987654321',
      email: 'jane.smith@example.com',
      leadSource: 'Referral',
      leadInterest: 'Product B',
      additionalNotes: 'Wants pricing information',
    },
    {
      channelPartnerCode: 'CP002',
      leadName: 'Alice Johnson',
      contactNumber: '1122334455',
      email: 'alice.johnson@example.com',
      leadSource: 'Website',
      leadInterest: 'Product C',
      additionalNotes: 'Looking for a bulk order',
    },
    {
      channelPartnerCode: 'CP002',
      leadName: 'Bob Brown',
      contactNumber: '5566778899',
      email: 'bob.brown@example.com',
      leadSource: 'Advertisement',
      leadInterest: 'Product D',
      additionalNotes: 'Needs detailed specs',
    },
    {
      channelPartnerCode: 'CP003',
      leadName: 'Charlie White',
      contactNumber: '6677889900',
      email: 'charlie.white@example.com',
      leadSource: 'Event',
      leadInterest: 'Product A',
      additionalNotes: 'Interested in partnership',
    },
    // Add more records to total 20
    {
      channelPartnerCode: 'CP003',
      leadName: 'Eva Green',
      contactNumber: '2233445566',
      email: 'eva.green@example.com',
      leadSource: 'Social Media',
      leadInterest: 'Product B',
      additionalNotes: 'Looking for product customization',
    },
    {
      channelPartnerCode: 'CP001',
      leadName: 'Frank Black',
      contactNumber: '3344556677',
      email: 'frank.black@example.com',
      leadSource: 'Referral',
      leadInterest: 'Product C',
      additionalNotes: 'Requires a sample',
    },
    {
      channelPartnerCode: 'CP001',
      leadName: 'Grace Silver',
      contactNumber: '4455667788',
      email: 'grace.silver@example.com',
      leadSource: 'Website',
      leadInterest: 'Product D',
      additionalNotes: 'Looking for a discount',
    },
    {
      channelPartnerCode: 'CP002',
      leadName: 'Henry Gold',
      contactNumber: '5566778899',
      email: 'henry.gold@example.com',
      leadSource: 'Advertisement',
      leadInterest: 'Product A',
      additionalNotes: 'Interested in long-term supply',
    },
    {
      channelPartnerCode: 'CP002',
      leadName: 'Isabel Blue',
      contactNumber: '6677889900',
      email: 'isabel.blue@example.com',
      leadSource: 'Event',
      leadInterest: 'Product B',
      additionalNotes: 'Requires urgent delivery',
    },
    {
      channelPartnerCode: 'CP003',
      leadName: 'Jack Red',
      contactNumber: '7788990011',
      email: 'jack.red@example.com',
      leadSource: 'Social Media',
      leadInterest: 'Product C',
      additionalNotes: 'Looking for referral bonuses',
    },
    {
      channelPartnerCode: 'CP003',
      leadName: 'Kate Pink',
      contactNumber: '8899001122',
      email: 'kate.pink@example.com',
      leadSource: 'Referral',
      leadInterest: 'Product D',
      additionalNotes: 'Interested in a franchise',
    },
    {
      channelPartnerCode: 'CP001',
      leadName: 'Liam Brown',
      contactNumber: '9900112233',
      email: 'liam.brown@example.com',
      leadSource: 'Website',
      leadInterest: 'Product A',
      additionalNotes: 'Looking for detailed brochure',
    },
    {
      channelPartnerCode: 'CP001',
      leadName: 'Mia Purple',
      contactNumber: '1011223344',
      email: 'mia.purple@example.com',
      leadSource: 'Advertisement',
      leadInterest: 'Product B',
      additionalNotes: 'Needs pricing comparison',
    },
    {
      channelPartnerCode: 'CP002',
      leadName: 'Noah Yellow',
      contactNumber: '1122334455',
      email: 'noah.yellow@example.com',
      leadSource: 'Event',
      leadInterest: 'Product C',
      additionalNotes: 'Wants to see testimonials',
    },
    {
      channelPartnerCode: 'CP002',
      leadName: 'Olivia Orange',
      contactNumber: '2233445566',
      email: 'olivia.orange@example.com',
      leadSource: 'Social Media',
      leadInterest: 'Product D',
      additionalNotes: 'Interested in a free trial',
    },
    {
      channelPartnerCode: 'CP003',
      leadName: 'Paul White',
      contactNumber: '3344556677',
      email: 'paul.white@example.com',
      leadSource: 'Referral',
      leadInterest: 'Product A',
      additionalNotes: 'Wants more information on service',
    },
    {
      channelPartnerCode: 'CP003',
      leadName: 'Quinn Black',
      contactNumber: '4455667788',
      email: 'quinn.black@example.com',
      leadSource: 'Website',
      leadInterest: 'Product B',
      additionalNotes: 'Looking for collaboration',
    },
    {
      channelPartnerCode: 'CP001',
      leadName: 'Ryan Blue',
      contactNumber: '5566778899',
      email: 'ryan.blue@example.com',
      leadSource: 'Advertisement',
      leadInterest: 'Product C',
      additionalNotes: 'Interested in a pilot project',
    },
    {
      channelPartnerCode: 'CP001',
      leadName: 'Sophie Green',
      contactNumber: '6677889900',
      email: 'sophie.green@example.com',
      leadSource: 'Event',
      leadInterest: 'Product D',
      additionalNotes: 'Needs assistance with implementation',
    }
  ];

  try {
    await Lead.insertMany(leads);
    console.log('20 leads have been successfully seeded!');
  } catch (error) {
    console.error('Error seeding leads:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedLeads();

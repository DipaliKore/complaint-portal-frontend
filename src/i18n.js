import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Login
      "login": "Login",
      "email": "Email",
      "password": "Password",
      "forgot_password": "Forgot Password?",
      "no_account": "Don't have an account?",
      "register": "Register",

      // Register
      "full_name": "Full Name",
      "already_account": "Already have an account?",
      "login_here": "Login here",

      // Dashboard
      "new_complaint": "New Complaint",
      "my_complaints": "My Complaints",
      "title": "Title",
      "description": "Description",
      "select_category": "Select Category",
      "attach_photo": "Attach Photo (Optional)",
      "submit_complaint": "Submit Complaint",
      "no_complaints": "No complaints found!",
      "logout": "Logout",

      // Status
      "pending": "PENDING",
      "in_progress": "IN PROGRESS",
      "resolved": "RESOLVED",

      // Admin
      "admin_dashboard": "Admin Dashboard",
      "all_complaints": "All Complaints",
      "total": "Total",

      // Categories
      "infrastructure": "Infrastructure",
      "water_supply": "Water Supply",
      "electricity": "Electricity",
      "sanitation": "Sanitation",
      "other": "Other",

      // Messages
      "complaint_success": "Complaint submitted successfully!",
      "complaint_error": "Error submitting complaint!",
    }
  },
  hi: {
    translation: {
      // Login
      "login": "लॉगिन करें",
      "email": "ईमेल",
      "password": "पासवर्ड",
      "forgot_password": "पासवर्ड भूल गए?",
      "no_account": "खाता नहीं है?",
      "register": "रजिस्टर करें",

      // Register
      "full_name": "पूरा नाम",
      "already_account": "पहले से खाता है?",
      "login_here": "यहाँ लॉगिन करें",

      // Dashboard
      "new_complaint": "नई शिकायत",
      "my_complaints": "मेरी शिकायतें",
      "title": "शीर्षक",
      "description": "विवरण",
      "select_category": "श्रेणी चुनें",
      "attach_photo": "फोटो संलग्न करें (वैकल्पिक)",
      "submit_complaint": "शिकायत दर्ज करें",
      "no_complaints": "कोई शिकायत नहीं मिली!",
      "logout": "लॉगआउट",

      // Status
      "pending": "लंबित",
      "in_progress": "प्रगति में",
      "resolved": "हल किया गया",

      // Admin
      "admin_dashboard": "व्यवस्थापक डैशबोर्ड",
      "all_complaints": "सभी शिकायतें",
      "total": "कुल",

      // Categories
      "infrastructure": "बुनियादी ढांचा",
      "water_supply": "जल आपूर्ति",
      "electricity": "बिजली",
      "sanitation": "स्वच्छता",
      "other": "अन्य",

      // Messages
      "complaint_success": "शिकायत सफलतापूर्वक दर्ज की गई!",
      "complaint_error": "शिकायत दर्ज करने में त्रुटि!",
    }
  },
  mr: {
    translation: {
      // Login
      "login": "लॉगिन करा",
      "email": "ईमेल",
      "password": "पासवर्ड",
      "forgot_password": "पासवर्ड विसरलात?",
      "no_account": "खाते नाही?",
      "register": "नोंदणी करा",

      // Register
      "full_name": "पूर्ण नाव",
      "already_account": "आधीच खाते आहे?",
      "login_here": "येथे लॉगिन करा",

      // Dashboard
      "new_complaint": "नवीन तक्रार",
      "my_complaints": "माझ्या तक्रारी",
      "title": "शीर्षक",
      "description": "वर्णन",
      "select_category": "श्रेणी निवडा",
      "attach_photo": "फोटो जोडा (ऐच्छिक)",
      "submit_complaint": "तक्रार नोंदवा",
      "no_complaints": "कोणतीही तक्रार आढळली नाही!",
      "logout": "लॉगआउट",

      // Status
      "pending": "प्रलंबित",
      "in_progress": "प्रगतीपथावर",
      "resolved": "निराकरण झाले",

      // Admin
      "admin_dashboard": "प्रशासक डॅशबोर्ड",
      "all_complaints": "सर्व तक्रारी",
      "total": "एकूण",

      // Categories
      "infrastructure": "पायाभूत सुविधा",
      "water_supply": "पाणीपुरवठा",
      "electricity": "वीज",
      "sanitation": "स्वच्छता",
      "other": "इतर",

      // Messages
      "complaint_success": "तक्रार यशस्वीरित्या नोंदवली!",
      "complaint_error": "तक्रार नोंदवताना त्रुटी!",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
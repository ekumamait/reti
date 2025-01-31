import jsPDF from "jspdf";
import { toast } from "react-toastify";

export const handleLogout = () => {
  localStorage.removeItem("loginDetails");
  return window.location.reload();
};

// Helper function to format the date to "distance from now"
export const formatDistanceToNow = (date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} years ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months ago`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days ago`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours ago`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes ago`;
  }
  return `${Math.floor(seconds)} seconds ago`;
};

export const loginDetails = () => {
  return JSON.parse(localStorage.getItem("loginDetails"));
};

export const userDetails = () => {
  return JSON.parse(localStorage.getItem("userDetails"));
};

export const getAccessToken = () => {
  const details = loginDetails();
  return details?.access_token;
};

export const getRefreshToken = () => {
  const details = loginDetails();
  return details?.refresh_token;
};

export const updateTokens = (access_token: string, refresh_token: string) => {
  const details = loginDetails();
  if (details) {
    const updatedDetails = {
      ...details,
      access_token,
      refresh_token,
    };
    localStorage.setItem("loginDetails", JSON.stringify(updatedDetails));
  }
};

const isTokenExpired = (token: string): boolean => {
    try {
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      const expiryTime = decodedPayload.exp * 1000;
      return Date.now() >= expiryTime;
    } catch {
      return true;
    }
  };
  
  export const checkAuthAndLogout = () => {
    const token = getAccessToken();
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('loginDetails');
      localStorage.removeItem('userDetails');
      window.location.href = '/login';
      return null;
    }
    return token;
  };

export const getHeaders = () => {
    const myHeaders = new Headers();
    const token = checkAuthAndLogout();
    if (token) {
        myHeaders.append("Authorization", `Bearer ${token}`);
    }
    return myHeaders;
}

export const handleDownloadData = (data: any) => {
  if (!data) {
    toast.error("Unable to download data at this moment. No data available.");
    return;
  }

  const userProfile = data?.data;
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;
  let currentY = 20; // Start position for content

  const addText = (text: string, x: number, y: number, fontStyle = "normal", fontSize = 12) => {
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);

    const splitText = doc.splitTextToSize(text, 190); // Wrap text
    if (currentY + splitText.length * 6 > pageHeight - margin) {
      doc.addPage(); // Add new page if content overflows
      currentY = margin;
    }
    doc.text(splitText, x, currentY);
    currentY += splitText.length * 6; // Update Y-coordinate
  };

  // Add section headers
  const addSectionHeader = (title: string) => {
    if (currentY + 10 > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, margin, currentY);
    currentY += 10; // Add spacing below section header
  };

  // Add Profile Information
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Profile Information", margin, currentY);
  currentY += 15;

  addSectionHeader("Personal Information");
  addText(`Full Name: ${userProfile?.user.firstName} ${userProfile?.user.lastName}`, margin, currentY);
  addText(`Date of Birth: ${new Date(userProfile?.dateOfBirth).toLocaleDateString()}`, margin, currentY);
  addText(`Gender: ${userProfile?.gender}`, margin, currentY);
  addText(`Location: ${userProfile?.location || "Not provided"}`, margin, currentY);
  addText(`Phone Number: ${userProfile?.phoneNumber}`, margin, currentY);
  addText(`Email: ${userProfile?.email}`, margin, currentY);

  addSectionHeader("Profile Summary");
  addText(userProfile?.bio || "No bio provided.", margin, currentY);

  addSectionHeader("Skills");
  const skills = userProfile?.skills || [];
  if (skills.length > 0) {
    skills.forEach((skill) => {
      addText(`• ${skill}`, margin + 5, currentY);
    });
  } else {
    addText("No skills provided.", margin, currentY);
  }

  addSectionHeader("Skills and Training Details");
  addText(`Trainee Category: ${userProfile?.skillsAndTraining?.traineeCategory || "N/A"}`, margin, currentY);
  addText(`Training Duration: ${userProfile?.skillsAndTraining?.trainingDuration || "N/A"}`, margin, currentY);
  addText(`Training Location: ${userProfile?.skillsAndTraining?.trainingLocation || "N/A"}`, margin, currentY);

  addSectionHeader("Artisan Details");
  addText(`Category of Artisan: ${userProfile?.artisanDetails?.categoryOfArtisan || "N/A"}`, margin, currentY);
  addText(`Name of Host: ${userProfile?.artisanDetails?.nameOfHost || "N/A"}`, margin, currentY);
  addText(`Village of Artisan: ${userProfile?.artisanDetails?.villageOfArtisan || "N/A"}`, margin, currentY);
  addText(`SubCounty of Artisan: ${userProfile?.artisanDetails?.subcountyOfArtisan || "N/A"}`, margin, currentY);
  addText(`Center Refugee Settlement: ${userProfile?.artisanDetails?.centerRefugeeSettlement || "N/A"}`, margin, currentY);
  addText(`Host Contact: ${userProfile?.artisanDetails?.hostContact || "N/A"}`, margin, currentY);

  addSectionHeader("GeoLocation Details");
  addText(`Partner Responsible: ${userProfile?.geoLocationDetails?.partnerResponsible || "N/A"}`, margin, currentY);
  addText(`Region: ${userProfile?.geoLocationDetails?.region || "N/A"}`, margin, currentY);
  addText(`District: ${userProfile?.geoLocationDetails?.district || "N/A"}`, margin, currentY);
  addText(`Settlement: ${userProfile?.geoLocationDetails?.settlement || "N/A"}`, margin, currentY);
  addText(`SubCounty: ${userProfile?.geoLocationDetails?.subCounty || "N/A"}`, margin, currentY);
  addText(`Parish Zone Cluster: ${userProfile?.geoLocationDetails?.parishZoneCluster || "N/A"}`, margin, currentY);
  addText(`Village: ${userProfile?.geoLocationDetails?.village || "N/A"}`, margin, currentY);

    addSectionHeader("Participants' Demographic and Social Characteristics");
  addText(`Name of Participant", ${userProfile?.participantDetails?.nameOfParticipant || "N/A"}`, margin, currentY);
  addText(`Group Number", ${userProfile?.participantDetails?.groupNumber || "N/A"}`, margin, currentY);
  addText(`Individual Number", ${userProfile?.participantDetails?.individualNumber|| "N/A"}`, margin, currentY);
  addText(`NIN, ${userProfile?.participantDetails?.nin || "N/A"}`, margin, currentY);
  addText(`Sex, ${userProfile?.participantDetails?.sex || "N/A"}`, margin, currentY);
  addText(`Age, ${userProfile?.participantDetails?.age || "N/A"}`, margin, currentY);
  addText(`Marital Status, ${userProfile?.participantDetails?.maritalStatus || "N/A"}`, margin, currentY);
  addText(`Special Interest Category, ${userProfile?.participantDetails?.specialInterestCategory || "N/A"}`, margin, currentY);
  addText(`Disability Type, ${userProfile?.participantDetails?.disabilityType || "N/A"}`, margin, currentY);
  addText(`Number of Disabilities, ${userProfile?.participantDetails?.numberOfDisabilities || "N/A"}`, margin, currentY);
  addText(`Main Disability Details, ${userProfile?.participantDetails?.mainDisabilityDetails || "N/A"}`, margin, currentY);
  addText(`Nationality Category, ${userProfile?.participantDetails?.nationalityCategory || "N/A"}`, margin, currentY);
  addText(`Unique ID No, ${userProfile?.participantDetails?.uniqueIdNo || "N/A"}`, margin, currentY);

  // Section: Training Centre/Institutional Details
  addSectionHeader("Training Centre/Institutional Details");
  addText(`Name of Training Centre, ${userProfile?.trainingCentreDetails?.nameOfTrainingCentre|| "N/A"}`, margin , currentY);
  addText(`Location Village, ${userProfile?.trainingCentreDetails?.locationVillage|| "N/A"}`, margin, currentY);
  addText(`Location SubCounty, ${userProfile?.trainingCentreDetails?.locationSubCounty|| "N/A"}`, margin, currentY);
  addText(`Location Settlement, ${userProfile?.trainingCentreDetails?.locationSettlement|| "N/A"}`, margin, currentY);
  addText(`Main Telephone Contact, ${userProfile?.trainingCentreDetails?.mainTelephoneContact|| "N/A"}`, margin, currentY);
  addText(`Alternative Telephone Contact, ${userProfile?.trainingCentreDetails?.alternativeTelephoneContact|| "N/A"}`, margin, currentY);

  // Section: Training Cohorts and Trades
  addSectionHeader("Training Cohorts and Trades");
  addText(`Cohort, ${userProfile?.trainingCohorts?.cohort || "N/A"}`, margin, currentY);
  addText(`Trade Taken During Training, ${userProfile?.trainingCohorts?.tradeTakenDuringTraining || "N/A"}`, margin, currentY);

  // Section: Time and Duration of RETI Training
  addSectionHeader("Time and Duration of RETI Training");
  addText(`Start Time, ${userProfile?.retiTrainingDetails?.startTime || "N/A"}`, margin, currentY);
  addText(`Completion Status, ${userProfile?.retiTrainingDetails?.completionStatus || "N/A"}`, margin, currentY);
  addText(`Reason for Dropping Out, ${userProfile?.retiTrainingDetails?.reasonForDroppingOut || "N/A"}`, margin, currentY);
  addText(`Months Spent, ${userProfile?.retiTrainingDetails?.monthsSpent || "N/A"}`, margin, currentY);
  addText(`Certification Status, ${userProfile?.retiTrainingDetails?.certificationStatus || "N/A"}`, margin, currentY);

  // Section: Internships and Start-Up Kits
  addSectionHeader("Internships and Start-Up Kits");
  addText(`Completion Time, ${userProfile?.internshipAndStartupDetails?.completionTime || "N/A"}`, margin, currentY);
  addText(`Internship Placement, ${userProfile?.internshipAndStartupDetails?.internshipPlacement || "N/A"}`, margin, currentY);
  addText(`Startup Kit Received, ${userProfile?.internshipAndStartupDetails?.startupKitReceived || "N/A"}`, margin, currentY);
  addText(`Startup Grant Received, ${userProfile?.internshipAndStartupDetails?.startupGrantReceived || "N/A"}`, margin, currentY);



  const fileName = `${userProfile?.user.firstName}_${userProfile?.user.lastName}.pdf`;
  doc.save(fileName);
};


export const formatRelativeTime = (createdAt: string) => {
  const date = new Date(createdAt);
  const now = new Date();
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const timeString = date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });

  if (targetDate.getTime() === today.getTime()) {
    return timeString;
  } else if (targetDate.getTime() === yesterday.getTime()) {
    return `Yesterday, ${timeString}`;
  } else if (today.getTime() - targetDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return `${date.toLocaleDateString('en-US', { weekday: 'long' })}, ${timeString}`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
};
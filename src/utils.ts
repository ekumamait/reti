import jsPDF from "jspdf";
import moment from "moment";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import logos from "./constants/logos.ts";

export const handleLogout = () => {
  localStorage.removeItem("loginDetails");
  return window.location.reload();
};

export const validateDOB = (_, value) => {
  if (!value) {
    return Promise.reject(new Error("Date of Birth is required"));
  }
  const today = moment();
  const birthDate = moment.isMoment(value) ? value : moment(value);
  const age = today.diff(birthDate, "years");
  if (age < 15) {
    return Promise.reject(new Error("You must be at least 15 years old"));
  }
  if (age > 150) {
    return Promise.reject(new Error("Please enter a valid Date of Birth"));
  }
  return Promise.resolve();
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

export const loginDetails = () =>
  JSON.parse(localStorage.getItem("loginDetails") || "null");

export const userDetails = () =>
  JSON.parse(localStorage.getItem("userDetails") || "null");

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
    const [, payload] = token.split(".");
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
    localStorage.removeItem("loginDetails");
    localStorage.removeItem("userDetails");
    window.location.href = "/login";
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
};

export const formatRelativeTime = (createdAt: string) => {
  const date = new Date(createdAt);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const timeString = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (targetDate.getTime() === today.getTime()) {
    return timeString;
  } else if (targetDate.getTime() === yesterday.getTime()) {
    return `Yesterday, ${timeString}`;
  } else if (today.getTime() - targetDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return `${date.toLocaleDateString("en-US", {
      weekday: "long",
    })}, ${timeString}`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

export const formatTwitterTime = (createdAt: string) => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Convert milliseconds to hours
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 24) {
    return `${hours}h`;
  }

  // Convert to days
  const days = Math.floor(hours / 24);
  if (days <= 7) {
    return `${days}d`;
  }

  // Format as DD/MM/YYYY for older dates
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const flattenObject = (obj: any, parentKey = ""): Record<string, any> => {
  let result: Record<string, any> = {};

  Object.entries(obj || {}).forEach(([key, value]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result = { ...result, ...flattenObject(value, fullKey) };
    } else if (Array.isArray(value)) {
      result[fullKey] = value.length > 0 ? value.join(", ") : "N/A";
    } else {
      result[fullKey] = value ?? "N/A";
    }
  });

  return result;
};

export const handleDownloadBulkData = (
  format: "csv" | "excel",
  usersWithMatchingPartner: any[]
) => {
  if (!usersWithMatchingPartner || usersWithMatchingPartner.length === 0) {
    console.warn("No data to export");
    return;
  }

  const EXCLUDED_FIELDS = [
    "theme",
    "user.id",
    "user.createdAt",
    "user.password",
    "userId",
    "updatedAt",
    "createdAt",
    "phoneNumber",
    "user.isOnboarded",
  ];

  const headerMap: Record<string, string> = {
    id: "ID",
    profileImage: "Profile Image",
    isRetiCandidate: "Reti Candidate",
    retiPartner: "Reti Partner",
    skills: "Skills",
    "stakeholderLinks.mentors": "Mentors",
    "stakeholderLinks.employers": "Employers",
    bio: "Bio",
    location: "Location",
    dateOfBirth: "Date of Birth",
    gender: "Gender",
    email: "Email",
    "skillsAndTraining.traineeCategory": "Trainee Category",
    "skillsAndTraining.trainingDuration": "Training Duration",
    "skillsAndTraining.trainingLocation": "Training Location",

    "artisanDetails.nameOfHost": "Name of Host",
    "artisanDetails.hostContact": "Host Contact",
    "artisanDetails.villageOfArtisan": "Village of Artisan",
    "artisanDetails.categoryOfArtisan": "Category of Artisan",
    "artisanDetails.subcountyOfArtisan": "Subcounty of Artisan",
    "artisanDetails.centerRefugeeSettlement": "Center Refugee Settlement",

    "geoLocationDetails.region": "Region",
    "geoLocationDetails.village": "Village",
    "geoLocationDetails.district": "District",
    "geoLocationDetails.subCounty": "Subcounty",
    "geoLocationDetails.settlement": "Settlement",
    "geoLocationDetails.parishZoneCluster": "Parish Zone Cluster",
    "geoLocationDetails.partnerResponsible": "Partner Responsible",

    "participantDetails.age": "Age",
    "participantDetails.nin": "NIN",
    "participantDetails.sex": "Sex",
    "participantDetails.uniqueIdNo": "Unique ID No",
    "participantDetails.groupNumber": "Group Number",
    "participantDetails.maritalStatus": "Marital Status",
    "participantDetails.disabilityType": "Disability Type",
    "participantDetails.individualNumber": "Individual Number",
    "participantDetails.nameOfParticipant": "Name Of Participant",
    "participantDetails.nationalityCategory": "Nationality Category",
    "participantDetails.numberOfDisabilities": "Number of Disabilities",
    "participantDetails.mainDisabilityDetails": "Main Disability Details",
    "participantDetails.specialInterestCategory": "Special Interest Category",

    "trainingCentreDetails.locationVillage": "Location Village",
    "trainingCentreDetails.locationSubCounty": "Location Subcounty",
    "trainingCentreDetails.locationSettlement": "Location Settlement",
    "trainingCentreDetails.mainTelephoneContact": "Main Telephone Contact",
    "trainingCentreDetails.nameOfTrainingCentre": "Name of Training Centre",
    "trainingCentreDetails.alternativeTelephoneContact":
      "Alternative Telephone Contact",

    "trainingCohorts.cohort": "Cohort",
    "trainingCohorts.tradeTakenDuringTraining": "Trade Taken During Training",

    "retiTrainingDetails.startTime": "Start Time",
    "retiTrainingDetails.monthsSpent": "Months Spent",
    "retiTrainingDetails.completionStatus": "Completion Status",
    "retiTrainingDetails.certificationStatus": "Certification Status",
    "retiTrainingDetails.reasonForDroppingOut": "Reason for Dropping Out",

    "internshipAndStartupDetails.completionTime": "Completion Time",
    "internshipAndStartupDetails.startupKitReceived": "Startup Kit Received",
    "internshipAndStartupDetails.internshipPlacement": "Internship Placement",
    "internshipAndStartupDetails.startupGrantReceived":
      "Startup Grant Received",

    "user.firstName": "First Name",
    "user.lastName": "Last Name",
    "user.phoneNumber": "Phone Number",
    "user.role": "Role",
  };

  const flattenAndCleanObject = (obj: any) => {
    return Object.fromEntries(
      Object.entries(flattenObject(obj))
        .filter(([key]) => !EXCLUDED_FIELDS.includes(key))
        .map(([key, value]) => [
          headerMap[key] || key.replace(/\./g, " "),
          value,
        ])
    );
  };

  const exportData = usersWithMatchingPartner.map(flattenAndCleanObject);

  if (format === "csv") {
    const csv = Papa.unparse({
      fields: Object.values(headerMap),
      data: exportData.map((obj) => Object.values(obj)),
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "user_profiles.csv");
  } else if (format === "excel") {
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.sheet_add_aoa(worksheet, [Object.values(headerMap)], {
      origin: "A1",
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(excelBlob, "user_profiles.xlsx");
  }
};

export const handleDownloadData = (data: any) => {
  if (!data) {
    toast.error("Unable to download data at this moment. No data available.");
    return;
  }

  const userProfile = data?.data;
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 10;
  let currentY = 20; // Start position for content

  const centerText = (text: string, fontSize = 12, yOffset = 0) => {
    if (!text) return;
    doc.setFontSize(fontSize);
    const scaleFactor = doc.internal.getScaleFactor
      ? doc.internal.getScaleFactor()
      : doc.internal.scaleFactor || 1;
    const textWidth = (doc.getStringUnitWidth(text) * fontSize) / scaleFactor;
    const textX = (pageWidth - textWidth) / 2;
    if (!isNaN(textX) && isFinite(textX)) {
      doc.text(text, textX, currentY + yOffset);
    }
  };

  const addFooter = () => {
    const footerY = pageHeight - 30;
    doc.setFontSize(10);
    doc.text("Generated by Retivate", margin, footerY);

    // Add line above logos with margin bottom
    doc.setLineWidth(0.5);
    doc.line(margin, Math.floor(footerY) - 60, pageWidth - margin, Math.floor(footerY) - 60);

    // Display logos in a grid format
    const logoWidth = 20;
    const logoHeight = 15;
    const columns = 5; // Number of logos per row
    const spacingX = (pageWidth - 2 * margin) / columns; // Spacing between logos
    const spacingY = 20; // Space between rows

    logos.forEach((logo, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const logoX = margin + col * spacingX;
      const logoY = footerY - row * spacingY - 30;

      doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);
    });
  };

  const addImage = (
    imageUrl: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    if (imageUrl) {
      try {
        doc.addImage(imageUrl, "JPEG", x, y, width, height);
      } catch (error) {
        console.error("Error adding image:", error);
      }
    }
  };

  console.log(userProfile?.profileImage);

  // Add User Image
  if (userProfile?.profileImage) {
    addImage(userProfile.profileImage, pageWidth / 2 - 25, 10, 50, 50);
    currentY += 60;
  }

  // Add Name & Contact
  doc.setFont("helvetica", "bold");
  centerText(
    `${userProfile?.user.firstName} ${userProfile?.user.lastName}`,
    18
  );
  doc.setFont("helvetica", "normal");
  centerText(userProfile?.user.email, 12, 10);
  centerText(userProfile?.user.phoneNumber, 12, 15);
  currentY += 30;

  const addText = (label: string, value: string | null | undefined, align: "left" | "right" = "left") => {
    if (!value) return;
    if (currentY + 10 > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
      addFooter();
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    const text = `${label}: ${value}`;
    const xPosition = align === "left" ? margin + 5 : pageWidth - margin - 5 - doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    
    doc.text(text, xPosition, currentY);
    currentY += 8;
  };

  const addSectionHeader = (title: string, align: "left" | "right" = "left") => {
    if (currentY + 10 > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
      addFooter();
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const xPosition = align === "left" ? margin : pageWidth - margin - doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    doc.text(title, xPosition, currentY);
    currentY += 10;
  };

  // Add Profile Information
  doc.setLineWidth(0.5);
  doc.line(margin, Math.floor(currentY) - 10, pageWidth - margin, Math.floor(currentY) - 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Profile Information", margin, currentY);
  currentY += 15;

  addSectionHeader("Profile Summary", "left");
  addText("Bio", userProfile?.bio || "No bio provided.", "left");

  addSectionHeader("Personal Information", "left");
  addText("Date of Birth", new Date(userProfile?.dateOfBirth).toLocaleDateString(), "left");
  addText("Gender", userProfile?.gender, "left");
  addText("Location", userProfile?.location, "left");

  addSectionHeader("Skills", "right");
  const skills = userProfile?.skills || [];
  if (skills.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    skills.forEach((skill, index) => {
      doc.text(`• ${skill}`, margin + 5, currentY + index * 6);
    });
    currentY += skills.length * 6 + 5;
  } else {
    addText("Skills", "No skills provided.", "right");
  }

  addSectionHeader("Skills and Training Details", "right");
  addText("Trainee Category", userProfile?.skillsAndTraining?.traineeCategory || "N/A", "right");
  addText("Training Duration", userProfile?.skillsAndTraining?.trainingDuration || "N/A", "right");
  addText("Training Location", userProfile?.skillsAndTraining?.trainingLocation || "N/A", "right");

  addSectionHeader("Artisan Details");
  addText("Category of Artisan", userProfile?.artisanDetails?.categoryOfArtisan || "N/A", "left");
  addText("Name of Host", userProfile?.artisanDetails?.nameOfHost || "N/A", "left");
  addText("Village of Artisan", userProfile?.artisanDetails?.villageOfArtisan || "N/A", "left");
  addText("SubCounty of Artisan", userProfile?.artisanDetails?.subcountyOfArtisan || "N/A", "left");
  addText("Center Refugee Settlement", userProfile?.artisanDetails?.centerRefugeeSettlement || "N/A", "left");

  addSectionHeader("GeoLocation Details");
  addText("Partner Responsible", userProfile?.geoLocationDetails?.partnerResponsible || "N/A", "left");
  addText("Region", userProfile?.geoLocationDetails?.region || "N/A", "left");
  addText("District", userProfile?.geoLocationDetails?.district || "N/A", "left");
  addText("SubCounty", userProfile?.geoLocationDetails?.subCounty || "N/A", "left");

  addSectionHeader("Participants' Demographic and Social Characteristics");
  addText("Nationality", userProfile?.participantDetails?.nationalityCategory || "N/A", "left");
  addText("Gender", userProfile?.participantDetails?.sex || "N/A", "left");
  addText("Marital Status", userProfile?.participantDetails?.maritalStatus || "N/A", "left");
  addText("Disability Type", userProfile?.participantDetails?.disabilityType || "N/A", "left");

  addSectionHeader("Training Centre Details");
  addText("Institution", userProfile?.trainingCentre?.institutionName || "N/A", "left");
  addText("Location", userProfile?.trainingCentre?.location || "N/A", "left");

  addSectionHeader("Training Cohorts and Trades");
  addText("Cohort", userProfile?.trainingCohorts?.cohort || "N/A", "left");
  addText("Trade Taken", userProfile?.trainingCohorts?.tradeTakenDuringTraining || "N/A", "left");

  addSectionHeader("Internships and Start-Up Kits");
  addText("Internship Placement", userProfile?.internshipAndStartupDetails?.internshipPlacement || "N/A", "left");
  addText("Startup Grant", userProfile?.internshipAndStartupDetails?.startupGrantReceived || "N/A", "left");

  addFooter();
  const fileName = `${userProfile?.user.firstName}_${userProfile?.user.lastName}.pdf`;
  doc.save(fileName);
};

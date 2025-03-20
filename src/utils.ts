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
  const margin = 15;

  // Define colors for NovoResume style
  const primaryColor = [41, 128, 185]; // Blue color for headers
  const secondaryColor = [52, 73, 94]; // Dark blue-gray for text
  const lightGrayColor = [189, 195, 199]; // Light gray for lines

  // Set text color to secondary by default
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

  // Define column widths for the three-column header layout
  const headerColWidth = (pageWidth - 2 * margin) / 3;

  // Define column widths for the two-column body layout
  const leftColWidth = pageWidth * 0.4; // Increased from 0.35
  const rightColWidth = pageWidth * 0.3; // Increased from 0.65
  const rightColStart = pageWidth - margin - rightColWidth; // Adjusted for extreme right

  // Start positions
  let headerY = 30; // Start position for header content
  let leftColY = 0; // Will be set after header
  let rightColY = 0; // Will be set after header

  // Helper functions
  const addSectionHeader = (
    title: string,
    x: number,
    y: number,
    align: "left" | "center" = "left"
  ) => {
    // Set color to primary for headers
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    if (align === "center") {
      const textWidth =
        (doc.getStringUnitWidth(title) * 14) / doc.internal.scaleFactor;
      x = (pageWidth - textWidth) / 2;
    }

    doc.text(title.toUpperCase(), x, y);

    // Add underline with primary color
    const textWidth =
      (doc.getStringUnitWidth(title) * 14) / doc.internal.scaleFactor;
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(x, y + 1, x + textWidth, y + 1);

    // Reset text color to secondary
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

    return y + 8; // Return new Y position
  };

  const addText = (
    text: string,
    x: number,
    y: number,
    fontSize = 10,
    fontStyle = "normal"
  ) => {
    if (!text) return y;
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.text(text, x, y);
    return y + fontSize * 0.3; // Reduced from 0.4
  };

  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize = 10,
    fontStyle = "normal"
  ) => {
    if (!text) return y;
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * fontSize * 0.4; // Reduced from 0.5
  };

  const addLabelValue = (
    label: string,
    value: any,
    x: number,
    y: number,
    maxWidth: number,
    fontSize = 10
  ) => {
    if (!value) return y;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    doc.text(`${label}: `, x, y);

    const labelWidth =
      (doc.getStringUnitWidth(`${label}: `) * fontSize) /
      doc.internal.scaleFactor;

    doc.setFont("helvetica", "normal");
    const valueText = value.toString();
    const lines = doc.splitTextToSize(valueText, maxWidth - labelWidth);

    if (lines.length === 1) {
      doc.text(valueText, x + labelWidth, y);
      return y + fontSize * 0.4; // Reduced from 0.5
    } else {
      doc.text(lines, x, y + fontSize * 0.4); // Reduced from 0.5
      return y + lines.length * fontSize * 0.4 + fontSize * 0.4; // Reduced from 0.5
    }
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
        // Add border radius and adjust dimensions
        doc.roundedRect(x, y, width, height, 10, 10, 'F'); // 10 is the border radius
        doc.addImage(
          imageUrl, 
          "JPEG", 
          x, 
          y, 
          width, 
          height
        );
      } catch (error) {
        console.error("Error adding image:", error);
      }
    }
  };

  const addFooter = () => {
    const footerY = pageHeight - 30;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(255, 0, 0); // Set text color to red
    const text = "Generated by Retivate";
    const textWidth =
      (doc.getStringUnitWidth(text) * 10) / doc.internal.scaleFactor;
    const textX = (pageWidth - textWidth) / 2; // Center the text
    doc.text(text, textX, footerY);

    // Add line above logos with margin bottom
    doc.setDrawColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
    doc.setLineWidth(0.3);
    doc.line(
      margin,
      Math.floor(footerY) - 60,
      pageWidth - margin,
      Math.floor(footerY) - 60
    );

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
      const logoY = footerY - row * spacingY - 30; // Adjusted for margin

      doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);
    });
  };

  // Add name at the top
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); // Primary color for name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  const nameText = `${userProfile?.user.firstName} ${userProfile?.user.lastName}`;
  const nameWidth =
    (doc.getStringUnitWidth(nameText) * 24) / doc.internal.scaleFactor;
  const nameX = (pageWidth - nameWidth) / 2;
  doc.text(nameText, nameX, 13);
  headerY -= 8;

  // Add title/role if available
  if (userProfile?.user.role) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    const roleText = userProfile.user.role;
    const roleWidth =
      (doc.getStringUnitWidth(roleText) * 13) / doc.internal.scaleFactor;
    const roleX = (pageWidth - roleWidth) / 2;
    doc.text(roleText, roleX, headerY);
    headerY += 4;
  } else {
    headerY += 5;
  }

  // Reset text color to secondary
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

  // THREE-COLUMN HEADER LAYOUT

  // Calculate positions for the three columns
  const leftHeaderCol = margin + 1;
  const middleHeaderCol = margin + headerColWidth;
  const rightHeaderCol = margin + 2 * headerColWidth + 20;

  // Left column: Bio
  if (userProfile?.bio) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(userProfile.bio, leftHeaderCol, headerY, {
      maxWidth: headerColWidth - 10,
    });
  }

  // Middle column: Profile Image
  if (userProfile?.profileImage) {
    const imageSize = 40; // You can adjust this size as needed
    const imageX = middleHeaderCol + (headerColWidth - imageSize) / 2;
    
    // Add border radius and adjust dimensions
    doc.roundedRect(imageX, headerY, imageSize, imageSize, 25, 25, 'F'); // 10 is the border radius
    doc.addImage(
      userProfile.profileImage, 
      "JPEG", 
      imageX, 
      headerY, 
      imageSize, 
      imageSize
    );
  }

  // Right column: Personal Summary
  let summaryY = headerY;
  if (userProfile?.dateOfBirth) {
    summaryY = addText(
      ` ${new Date(userProfile.dateOfBirth).toLocaleDateString()}`,
      rightHeaderCol,
      summaryY,
      10
    );
    summaryY += 3;
  }
  if (userProfile?.gender) {
    summaryY = addText(` ${userProfile.gender}`, rightHeaderCol, summaryY, 10);
    summaryY += 3;
  }
  if (userProfile?.location) {
    summaryY = addText(
      ` ${userProfile.location}`,
      rightHeaderCol,
      summaryY,
      10
    );
    summaryY += 3;
  }
  if (userProfile?.user.email) {
    summaryY = addText(
      ` ${userProfile.user.email}`,
      rightHeaderCol,
      summaryY,
      10
    );
    summaryY += 3;
  }
  if (userProfile?.user.phoneNumber) {
    summaryY = addText(
      ` ${userProfile.user.phoneNumber}`,
      rightHeaderCol,
      summaryY,
      10
    );
  }

  // Calculate the height of the header section
  const headerHeight = Math.max(
    userProfile?.bio
      ? doc.splitTextToSize(userProfile.bio, headerColWidth - 10).length * 5
      : 0,
    userProfile?.profileImage ? 45 : 0,
    summaryY - headerY + 10
  );

  // Set starting positions for the two-column body layout
  leftColY = headerY + headerHeight + 20;
  rightColY = leftColY;

  // Add a horizontal line to separate header from body
  doc.setDrawColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, leftColY - 10, pageWidth - margin, leftColY - 10);

  // TWO-COLUMN BODY LAYOUT

  // LEFT COLUMN CONTENT

  // Skills
  if (userProfile?.skills && userProfile.skills.length > 0) {
    leftColY = addSectionHeader("SKILLS", margin, leftColY);
    leftColY -= 6;

    userProfile.skills.forEach((skill: string) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`• ${skill}`, margin, leftColY + 5);
      leftColY += 6;
    });
    leftColY += 8;
  }

  // Artisan Details
  if (userProfile?.artisanDetails) {
    leftColY = addSectionHeader("ARTISAN DETAILS", margin, leftColY);
    leftColY -= 6;

    if (userProfile.artisanDetails.categoryOfArtisan) {
      leftColY = addLabelValue(
        "Category",
        userProfile.artisanDetails.categoryOfArtisan,
        margin,
        leftColY + 3,
        leftColWidth - 5
      );
    }
    if (userProfile.artisanDetails.nameOfHost) {
      leftColY = addLabelValue(
        "Host Name",
        userProfile.artisanDetails.nameOfHost,
        margin,
        leftColY + 3,
        leftColWidth - 5
      );
    }
    if (userProfile.artisanDetails.villageOfArtisan) {
      leftColY = addLabelValue(
        "Village",
        userProfile.artisanDetails.villageOfArtisan,
        margin,
        leftColY + 3,
        leftColWidth - 5
      );
    }
    if (userProfile.artisanDetails.subcountyOfArtisan) {
      leftColY = addLabelValue(
        "Subcounty",
        userProfile.artisanDetails.subcountyOfArtisan,
        margin,
        leftColY + 3,
        leftColWidth - 5
      );
    }
    if (userProfile.artisanDetails.centerRefugeeSettlement) {
      leftColY = addLabelValue(
        "Settlement",
        userProfile.artisanDetails.centerRefugeeSettlement,
        margin,
        leftColY + 3,
        leftColWidth - 5
      );
    }

    leftColY += 8;
  }

  // GeoLocation Details
  if (userProfile?.geoLocationDetails) {
    leftColY = addSectionHeader("GEOLOCATION DETAILS", margin, leftColY);
    leftColY -= 6;

    if (userProfile.geoLocationDetails.partnerResponsible) {
      leftColY = addLabelValue(
        "Partner",
        userProfile.geoLocationDetails.partnerResponsible,
        margin,
        leftColY + 3,
        leftColWidth - 5
      );
    }
    if (userProfile.geoLocationDetails.region) {
      leftColY = addLabelValue(
        "Region",
        userProfile.geoLocationDetails.region,
        margin,
        leftColY + 3,
        leftColWidth - 5
      );
    }
    if (userProfile.geoLocationDetails.district) {
      leftColY = addLabelValue(
        "District",
        userProfile.geoLocationDetails.district,
        margin,
        leftColY + 3,
        leftColWidth - 5
      );
    }
    if (userProfile.geoLocationDetails.subCounty) {
      leftColY = addLabelValue(
        "Subcounty",
        userProfile.geoLocationDetails.subCounty,
        margin,
        leftColY + 3,
        leftColWidth - 5
      );
    }

    leftColY += 8;
  }

  // RIGHT COLUMN CONTENT

  // Participant Details
  if (userProfile?.participantDetails) {
    rightColY = addSectionHeader(
      "PARTICIPANT DETAILS",
      rightColStart,
      rightColY
    );
    rightColY -= 6;
    if (userProfile.participantDetails.nationalityCategory) {
      rightColY = addLabelValue(
        "Nationality",
        userProfile.participantDetails.nationalityCategory,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }
    if (userProfile.participantDetails.sex) {
      rightColY = addLabelValue(
        "Gender",
        userProfile.participantDetails.sex,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }
    if (userProfile.participantDetails.maritalStatus) {
      rightColY = addLabelValue(
        "Marital Status",
        userProfile.participantDetails.maritalStatus,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }
    if (userProfile.participantDetails.disabilityType) {
      rightColY = addLabelValue(
        "Disability Type",
        userProfile.participantDetails.disabilityType,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }

    rightColY += 8;
  }

  // Training Centre Details
  if (userProfile?.trainingCentre) {
    rightColY = addSectionHeader(
      "TRAINING CENTRE DETAILS",
      rightColStart,
      rightColY
    );
    rightColY -= 6;
    if (userProfile.trainingCentre.institutionName) {
      rightColY = addLabelValue(
        "Institution",
        userProfile.trainingCentre.institutionName,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }
    if (userProfile.trainingCentre.location) {
      rightColY = addLabelValue(
        "Location",
        userProfile.trainingCentre.location,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }

    rightColY += 8;
  }

  // Skills and Training Details
  if (userProfile?.skillsAndTraining) {
    rightColY = addSectionHeader(
      "TRAINING",
      rightColStart,
      rightColY
    );
    rightColY -= 6;

    if (userProfile.skillsAndTraining.traineeCategory) {
      rightColY = addLabelValue(
        "Trainee Category",
        userProfile.skillsAndTraining.traineeCategory,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }
    if (userProfile.skillsAndTraining.trainingDuration) {
      rightColY = addLabelValue(
        "Duration",
        userProfile.skillsAndTraining.trainingDuration,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }
    if (userProfile.skillsAndTraining.trainingLocation) {
      rightColY = addLabelValue(
        "Location",
        userProfile.skillsAndTraining.trainingLocation,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }

    rightColY += 8;
  }

  // Training Cohorts
  if (userProfile?.trainingCohorts) {
    rightColY = addSectionHeader("COHORTS", rightColStart, rightColY);
    rightColY -= 6;

    if (userProfile.trainingCohorts.cohort) {
      rightColY = addLabelValue(
        "Cohort",
        userProfile.trainingCohorts.cohort,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }
    if (userProfile.trainingCohorts.tradeTakenDuringTraining) {
      rightColY = addLabelValue(
        "Trade Taken",
        userProfile.trainingCohorts.tradeTakenDuringTraining,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }

    rightColY += 8;
  }

  // Internship and Startup Details
  if (userProfile?.internshipAndStartupDetails) {
    rightColY = addSectionHeader(
      "INTERNSHIP AND STARTUP",
      rightColStart,
      rightColY
    );
    rightColY -= 6;

    if (userProfile.internshipAndStartupDetails.internshipPlacement) {
      rightColY = addLabelValue(
        "Internship",
        userProfile.internshipAndStartupDetails.internshipPlacement,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }
    if (userProfile.internshipAndStartupDetails.startupGrantReceived) {
      rightColY = addLabelValue(
        "Startup Grant",
        userProfile.internshipAndStartupDetails.startupGrantReceived,
        rightColStart,
        rightColY + 3,
        rightColWidth - 5
      );
    }

    rightColY += 8;
  }

  // Add footer
  addFooter();

  // Save the PDF
  const fileName = `${userProfile?.user.firstName}_${userProfile?.user.lastName}.pdf`;
  doc.save(fileName);
};

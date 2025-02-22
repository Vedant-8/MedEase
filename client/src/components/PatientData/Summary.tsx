import React, { useEffect, useState } from "react";
import { Card, Typography, Grid, Snackbar, Alert } from "@mui/material";
import NotificationAddIcon from "@mui/icons-material/NotificationAdd";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"; // ShadCN charting tools
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import medicationData from "../../../../server/services/webhook/temp_jsons/medication_statement.json";

const Summary: React.FC = () => {
  const [medications, setMedications] = useState<any[]>([]);
  const [reminderStatus, setReminderStatus] = useState<Record<string, boolean>>(
    {}
  );
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  // Updated 6 months data for activity charts
  const monthWiseData = [
    { name: "Jan", steps: 3000 },
    { name: "Feb", steps: 4000 },
    { name: "Mar", steps: 3500 },
    { name: "Apr", steps: 4200 },
    { name: "May", steps: 5000 },
    { name: "Jun", steps: 4800 },
  ];

  const activityPieData = [
    { name: "Biking", value: 50 },
    { name: "Walking", value: 100 },
    { name: "Running", value: 80 },
    { name: "Calisthenics", value: 60 },
    { name: "Paced Walking", value: 40 },
  ];

  // Load medications on component mount
  useEffect(() => {
    const activeMeds = medicationData.filter((med) => med.status === "active");
    setMedications(activeMeds);

    // Initialize reminders for each medication
    const initialReminders = activeMeds.reduce((acc, med) => {
      acc[med.id] = false; // No reminders set initially
      return acc;
    }, {} as Record<string, boolean>);
    setReminderStatus(initialReminders);
  }, []);

  // Toggle Reminder
  const toggleReminder = (medicationId: string, medicationName: string) => {
    setReminderStatus((prevStatus) => {
      const isReminderSet = !prevStatus[medicationId];
      setSnackbarMessage(
        isReminderSet
          ? `Reminder for ${medicationName} is set!`
          : `Reminder for ${medicationName} is removed!`
      );
      return { ...prevStatus, [medicationId]: isReminderSet };
    });
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarMessage(null);
  };

  return (
    <div className="w-full p-4">
      {/* Section 1: Graphs */}
      <Typography variant="h5" className="mb-4 pl-4 text-center text-red-600">
        Activity & Health Summary
      </Typography>
      <Grid container spacing={4}>
        {/* Graph 1: Month-wise steps bar chart */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            className="p-4 bg-white rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <Typography variant="h6" className="mb-4 text-center text-gray-700">
              Monthly Steps
            </Typography>
            <BarChart
              width={380}
              height={250}
              data={monthWiseData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="steps" fill="#FF6F61" radius={4} />
            </BarChart>
          </Card>
        </Grid>

        {/* Graph 2: Pie chart of different activities */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            className="p-4 bg-white rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            <Typography variant="h6" className="mb-4 text-center text-gray-700">
              Activity Breakdown
            </Typography>
            <PieChart width={380} height={250}>
              <Pie
                data={activityPieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#FF6F61"
                label
              >
                {activityPieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#FFB3B3", "#FF6666", "#FF4040", "#E60000", "#B30000"][
                        index
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Card>
        </Grid>
      </Grid>

      {/* Section 2: Active Medications */}
      <Typography variant="h5" className="mt-8 mb-4 pl-4 text-red-600">
        Active Medications
      </Typography>
      <div>
        {medications.map((med) => (
          <Card
            key={med.id}
            className="p-4 mb-2 shadow-md transition-all duration-300 hover:shadow-lg bg-blue-200"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#e3e9fc",
              fontSize: "14px",
              width: "100%",
            }}
          >
            {/* Medication Name */}
            <Typography
              variant="body1"
              sx={{
                textAlign: "left",
                color: "#616161",
                fontWeight: "bold",
                flex: 1, // Take up available space
              }}
            >
              {med.Medication}
            </Typography>

            {/* Reminder Icon */}
            <div
              onClick={() => toggleReminder(med.id, med.Medication)}
              style={{ cursor: "pointer", paddingLeft: "16px" }}
            >
              {reminderStatus[med.id] ? (
                <NotificationsOffIcon sx={{ color: "#f44336" }} />
              ) : (
                <NotificationAddIcon sx={{ color: "#4caf50" }} />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Snackbar for reminder messages */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Section 3: Health Tips */}
      <Typography
        variant="h5"
        className="mt-8 mb-4 pl-4 text-red-600 flex items-center justify-center"
      >
        <TipsAndUpdatesIcon className="mr-2" /> Health Tips
      </Typography>
      <ul className="list-disc pl-6 text-gray-700">
        <li>Stay hydrated by drinking plenty of water throughout the day.</li>
        <li>Incorporate more fruits and vegetables into your diet.</li>
        <li>Get at least 30 minutes of moderate exercise daily.</li>
      </ul>
    </div>
  );
};

export default Summary;

import React, { useState } from "react";
import "./LeaveCalendar.css";

const LeaveCalendar = ({ leaveData, loading }) => {
  const [,] = useState(new Date()); // Removed unused currentDate and setCurrentDate
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  if (loading) {
    return <div className="calendar-loading">Loading leave calendar...</div>;
  }

  // Get calendar data for the selected month/year
  const getCalendarData = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days = [];
    const currentDay = new Date(startDate);

    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  // Get leaves for a specific date
  const getLeavesForDate = (date) => {
    if (!leaveData) return [];

    const dateStr = date.toISOString().split("T")[0];
    return leaveData.filter((leave) => {
      if (leave.status !== "approved") return false;

      const startDate = new Date(leave.start_date).toISOString().split("T")[0];
      const endDate = new Date(leave.end_date).toISOString().split("T")[0];

      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  // Check if date is in current month
  const isCurrentMonth = (date) => {
    return date.getMonth() === selectedMonth;
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newDate = new Date(selectedYear, selectedMonth + direction, 1);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  };

  // Get month name
  const getMonthName = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  };

  // Get leave statistics for current month
  const getMonthlyStats = () => {
    if (!leaveData)
      return { totalLeaves: 0, approvedLeaves: 0, pendingLeaves: 0 };

    const monthStart = new Date(selectedYear, selectedMonth, 1);
    const monthEnd = new Date(selectedYear, selectedMonth + 1, 0);

    const monthlyLeaves = leaveData.filter((leave) => {
      const leaveStart = new Date(leave.start_date);
      const leaveEnd = new Date(leave.end_date);

      return leaveStart <= monthEnd && leaveEnd >= monthStart;
    });

    return {
      totalLeaves: monthlyLeaves.length,
      approvedLeaves: monthlyLeaves.filter((l) => l.status === "approved")
        .length,
      pendingLeaves: monthlyLeaves.filter((l) => l.status === "pending").length,
    };
  };

  const calendarDays = getCalendarData();
  const monthlyStats = getMonthlyStats();

  return (
    <div className="leave-calendar-container">
      <h2 className="calendar-title">📅 Leave Calendar</h2>

      {/* Monthly Statistics */}
      <div className="monthly-stats">
        <div className="stat-card">
          <span className="stat-value">{monthlyStats.totalLeaves}</span>
          <span className="stat-label">📋 Total Leaves</span>
        </div>
        <div className="stat-card approved">
          <span className="stat-value">{monthlyStats.approvedLeaves}</span>
          <span className="stat-label">✅ Approved</span>
        </div>
        <div className="stat-card pending">
          <span className="stat-value">{monthlyStats.pendingLeaves}</span>
          <span className="stat-label">⏳ Pending</span>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="calendar-navigation">
        <button className="nav-btn" onClick={() => navigateMonth(-1)}>
          ← Previous
        </button>

        <div className="current-month">
          <h3>
            {getMonthName(selectedMonth)} {selectedYear}
          </h3>
        </div>

        <button className="nav-btn" onClick={() => navigateMonth(1)}>
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Day Headers */}
        <div className="calendar-header">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="calendar-body">
          {calendarDays.map((date, index) => {
            const dayLeaves = getLeavesForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                className={`calendar-day ${
                  !isCurrentMonthDay ? "other-month" : ""
                } ${isTodayDate ? "today" : ""} ${
                  dayLeaves.length > 0 ? "has-leaves" : ""
                }`}
              >
                <div className="day-number">{date.getDate()}</div>

                {dayLeaves.length > 0 && (
                  <div className="leave-indicators">
                    {dayLeaves.slice(0, 3).map((leave, idx) => (
                      <div
                        key={idx}
                        className="leave-indicator"
                        title={`${leave.first_name} ${leave.last_name} - ${leave.reason}`}
                      >
                        {leave.first_name.charAt(0)}
                        {leave.last_name.charAt(0)}
                      </div>
                    ))}
                    {dayLeaves.length > 3 && (
                      <div
                        className="leave-indicator more"
                        title={`+${dayLeaves.length - 3} more`}
                      >
                        +{dayLeaves.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color today-color"></div>
          <span>Today</span>
        </div>
        <div className="legend-item">
          <div className="legend-color leave-color"></div>
          <span>Has Leave(s)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color other-month-color"></div>
          <span>Other Month</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button
          className="quick-action-btn"
          onClick={() => {
            const today = new Date();
            setSelectedMonth(today.getMonth());
            setSelectedYear(today.getFullYear());
          }}
        >
          📅 Go to Today
        </button>

        <button className="quick-action-btn">📊 Export Calendar</button>
      </div>
    </div>
  );
};

export default LeaveCalendar;

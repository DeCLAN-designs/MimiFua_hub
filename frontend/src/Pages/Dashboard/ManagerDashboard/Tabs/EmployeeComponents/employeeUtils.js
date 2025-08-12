// Employee utility functions

export const defaultForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  password: "",
  role: "employee",
  status: "active",
};

export const validateForm = (formData, editMode = false) => {
  const errors = {};
  
  // Name validation
  if (!formData.first_name.trim())
    errors.first_name = "First name is required";
  if (!formData.last_name.trim()) 
    errors.last_name = "Last name is required";
  
  // Email validation
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
  }
  
  // Phone validation
  if (!formData.phone.trim()) {
    errors.phone = "Phone is required";
  } else {
    const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
  }
  
  // Password validation
  if (!editMode && !formData.password.trim()) {
    errors.password = "Password is required";
  } else if (!editMode && formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  }
  
  return errors;
};

export const filterEmployees = (employees, searchTerm, statusFilter) => {
  return employees.filter(employee => {
    const matchesSearch = 
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
};

export const sortEmployees = (employees, sortField, sortDirection) => {
  return employees.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === "full_name") {
      aValue = `${a.first_name} ${a.last_name}`;
      bValue = `${b.first_name} ${b.last_name}`;
    }
    
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

export const paginateEmployees = (employees, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return {
    paginatedEmployees: employees.slice(startIndex, startIndex + itemsPerPage),
    totalPages: Math.ceil(employees.length / itemsPerPage),
    startIndex
  };
};

export const getSortIcon = (field, sortField, sortDirection) => {
  if (sortField !== field) return "↕️";
  return sortDirection === "asc" ? "↑" : "↓";
};

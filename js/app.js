"use strict";

var STUDENT_NUMBER_PATTERN = /^\d{2}-\d{4}-\d{3}$/;
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var MOBILE_PATTERN = /^(09\d{9}|\+639\d{9})$/;

function isValidStudentNumber(value) {
  if (typeof value !== "string") {
    return false;
  }
  return STUDENT_NUMBER_PATTERN.test(value.trim());
}

function getPasswordIssues(value) {
  var issues = [];
  if (typeof value !== "string") {
    return ["a password"];
  }
  if (value.length < 8) {
    issues.push("at least 8 characters");
  }
  if (!/[A-Z]/.test(value)) {
    issues.push("one uppercase letter");
  }
  if (!/\d/.test(value)) {
    issues.push("one digit");
  }
  if (!/[@$!]/.test(value)) {
    issues.push("one of @, $, or !");
  }
  if (/\s/.test(value)) {
    issues.push("no spaces");
  }
  return issues;
}

function isValidPassword(value) {
  return getPasswordIssues(value).length === 0;
}

function isValidEmail(value) {
  return typeof value === "string" && EMAIL_PATTERN.test(value.trim());
}

function isValidMobile(value) {
  return typeof value === "string" && MOBILE_PATTERN.test(value.trim());
}

if (typeof document !== "undefined") {
  var form = document.getElementById("registrationForm");
  var fields = {
    fullName: document.getElementById("fullName"),
    studentNumber: document.getElementById("studentNumber"),
    email: document.getElementById("email"),
    mobileNumber: document.getElementById("mobileNumber"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    course: document.getElementById("course"),
    terms: document.getElementById("terms")
  };
  var passwordFeedback = document.getElementById("passwordFeedback");
  var successMessage = document.getElementById("successMessage");
  var registrationSummary = document.getElementById("registrationSummary");

  function setError(name, message) {
    document.getElementById(name + "Error").textContent = message;
    fields[name].setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  function validateFullName() {
    var name = fields.fullName.value.trim();
    if (name.length === 0) {
      return setError("fullName", "Enter your full name.");
    }
    if (name.length < 2) {
      return setError("fullName", "Your full name must have at least 2 characters.");
    }
    return setError("fullName", "");
  }

  function validateStudentNumber() {
    var value = fields.studentNumber.value.trim();
    if (value.length === 0) {
      return setError("studentNumber", "Enter your student number.");
    }
    if (!isValidStudentNumber(value)) {
      return setError("studentNumber", "Enter a student number in the format 24-1234-123.");
    }
    return setError("studentNumber", "");
  }

  function validateEmail() {
    var value = fields.email.value.trim();
    if (value.length === 0) {
      return setError("email", "Enter your email address.");
    }
    if (!isValidEmail(value)) {
      return setError("email", "Enter a valid email address, such as name@example.com.");
    }
    return setError("email", "");
  }

  function validateMobile() {
    var value = fields.mobileNumber.value.trim();
    if (value.length === 0) {
      return setError("mobileNumber", "Enter your mobile number.");
    }
    if (!isValidMobile(value)) {
      return setError("mobileNumber", "Enter a mobile number as 09XXXXXXXXX or +639XXXXXXXXX, without spaces or hyphens.");
    }
    return setError("mobileNumber", "");
  }

  function validatePassword() {
    var value = fields.password.value;
    if (value.length === 0) {
      return setError("password", "Enter a password.");
    }
    if (!isValidPassword(value)) {
      return setError("password", "Password must have " + getPasswordIssues(value).join(", ") + ".");
    }
    return setError("password", "");
  }

  function validateConfirmPassword() {
    var value = fields.confirmPassword.value;
    if (value.length === 0) {
      return setError("confirmPassword", "Confirm your password.");
    }
    if (value !== fields.password.value) {
      return setError("confirmPassword", "Passwords do not match.");
    }
    return setError("confirmPassword", "");
  }

  function validateCourse() {
    var value = fields.course.value;
    if (value !== "BSIT" && value !== "BSCS") {
      return setError("course", "Select BSIT or BSCS.");
    }
    return setError("course", "");
  }

  function validateTerms() {
    if (!fields.terms.checked) {
      return setError("terms", "You must agree to the terms to register.");
    }
    return setError("terms", "");
  }

  function updatePasswordFeedback() {
    var value = fields.password.value;
    if (value.length === 0) {
      passwordFeedback.textContent = "";
      passwordFeedback.className = "feedback";
      return;
    }
    var issues = getPasswordIssues(value);
    if (issues.length === 0) {
      passwordFeedback.textContent = "Password meets all requirements.";
      passwordFeedback.className = "feedback ok";
    } else {
      passwordFeedback.textContent = "Password still needs: " + issues.join(", ") + ".";
      passwordFeedback.className = "feedback";
    }
  }

  function hideResults() {
    successMessage.textContent = "";
    successMessage.hidden = true;
    registrationSummary.hidden = true;
    document.getElementById("summaryName").textContent = "";
    document.getElementById("summaryStudentNumber").textContent = "";
    document.getElementById("summaryEmail").textContent = "";
    document.getElementById("summaryMobileNumber").textContent = "";
    document.getElementById("summaryCourse").textContent = "";
  }

  function showSummary() {
    successMessage.textContent = "Registration details validated successfully!";
    successMessage.hidden = false;
    registrationSummary.hidden = false;
    document.getElementById("summaryName").textContent = fields.fullName.value.trim();
    document.getElementById("summaryStudentNumber").textContent = fields.studentNumber.value.trim();
    document.getElementById("summaryEmail").textContent = fields.email.value.trim();
    document.getElementById("summaryMobileNumber").textContent = fields.mobileNumber.value.trim();
    document.getElementById("summaryCourse").textContent = fields.course.value;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    hideResults();

    var results = [
      validateFullName(),
      validateStudentNumber(),
      validateEmail(),
      validateMobile(),
      validatePassword(),
      validateConfirmPassword(),
      validateCourse(),
      validateTerms()
    ];
    updatePasswordFeedback();

    if (results.every(function (ok) { return ok; })) {
      showSummary();
    } else {
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });

  fields.password.addEventListener("input", function () {
    updatePasswordFeedback();
    if (fields.password.getAttribute("aria-invalid") === "true") {
      validatePassword();
    }
    if (fields.confirmPassword.value.length > 0) {
      validateConfirmPassword();
    }
  });

  fields.confirmPassword.addEventListener("input", function () {
    if (fields.confirmPassword.getAttribute("aria-invalid") === "true") {
      validateConfirmPassword();
    }
  });

  fields.fullName.addEventListener("blur", validateFullName);

  fields.fullName.addEventListener("input", function () {
    if (fields.fullName.getAttribute("aria-invalid") === "true") { validateFullName(); }
  });
  fields.studentNumber.addEventListener("input", function () {
    if (fields.studentNumber.getAttribute("aria-invalid") === "true") { validateStudentNumber(); }
  });
  fields.email.addEventListener("input", function () {
    if (fields.email.getAttribute("aria-invalid") === "true") { validateEmail(); }
  });
  fields.mobileNumber.addEventListener("input", function () {
    if (fields.mobileNumber.getAttribute("aria-invalid") === "true") { validateMobile(); }
  });

  fields.course.addEventListener("change", validateCourse);
  fields.terms.addEventListener("change", validateTerms);

  form.addEventListener("reset", function () {
    Object.keys(fields).forEach(function (name) {
      document.getElementById(name + "Error").textContent = "";
      fields[name].setAttribute("aria-invalid", "false");
    });
    passwordFeedback.textContent = "";
    passwordFeedback.className = "feedback";
    hideResults();
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    isValidStudentNumber: isValidStudentNumber,
    isValidPassword: isValidPassword
  };
}
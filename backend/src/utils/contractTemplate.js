const contractTemplate = {
  templateName: 'Employment Contract',
  fields: [
    // Identification of Parties
    { label: 'Employer Name', type: 'text', key: 'employerName' },
    { label: 'Employer Address', type: 'text', key: 'employerAddress' },
    { label: 'Employee Full Name', type: 'text', key: 'employeeFullName' },
    { label: 'Employee Address', type: 'text', key: 'employeeAddress' },

    // Job Information
    { label: 'Job Title', type: 'text', key: 'jobTitle' },
    { label: 'Department', type: 'text', key: 'department' },
    { label: 'Reports To', type: 'text', key: 'reportsTo' },
    { label: 'Job Description', type: 'textarea', key: 'jobDescription' },

    // Place of Work
    { label: 'Primary Work Location', type: 'text', key: 'primaryWorkLocation' },
    { label: 'Relocation Conditions', type: 'textarea', key: 'relocationConditions' },
    { label: 'Remote Work Policy', type: 'text', key: 'remoteWorkPolicy' },
    { label: 'Remote Work Description', type: 'textarea', key: 'remoteWorkDescription' },

    // Start Date and Duration
    { label: 'Start Date', type: 'date', key: 'startDate' },
    { label: 'Contract Type', type: 'text', key: 'contractType' },
    { label: 'End Date', type: 'date', key: 'endDate' },

    // Compensation and Benefits
    { label: 'Base Salary', type: 'text', key: 'baseSalary' },
    { label: 'Payment Frequency', type: 'text', key: 'paymentFrequency' },
    // New payment fields
    { label: 'Amount to be Paid Per Session', type: 'text', key: 'amountPerSession' },
    { label: 'Mode of Payment', type: 'text', key: 'modeOfPayment' },
    { label: 'Terms and Conditions for Payment', type: 'textarea', key: 'paymentTerms' },
    { label: 'Rate Adjustment for Contract Renewal', type: 'textarea', key: 'rateAdjustment' },
    // End of new payment fields
    { label: 'Bonuses & Commissions', type: 'textarea', key: 'bonusesCommissions' },
    { label: 'Benefits', type: 'textarea', key: 'benefits' },

    // Work Hours and Leave
    { label: 'Working Hours Per Week', type: 'text', key: 'workingHoursPerWeek' },
    { label: 'Working Hours Start Time', type: 'text', key: 'workingHoursStart' },
    { label: 'Working Hours End Time', type: 'text', key: 'workingHoursEnd' },
    { label: 'Working Hours By Day', type: 'custom', key: 'workingHoursByDay' },
    { label: 'Overtime Policy', type: 'textarea', key: 'overtimePolicy' },
    { label: 'Annual Leave Days', type: 'text', key: 'annualLeaveDays' },
    { label: 'Sick Leave Policy', type: 'textarea', key: 'sickLeavePolicy' },
    { label: 'Unpaid Leave Conditions', type: 'textarea', key: 'unpaidLeaveConditions' },

    // Legal and Policy Clauses
    { label: 'Termination Conditions', type: 'textarea', key: 'terminationConditions' },
    { label: 'Employee Notice Period', type: 'text', key: 'employeeNoticePeriod' },
    { label: 'Employer Notice Period', type: 'text', key: 'employerNoticePeriod' },
    { label: 'Grounds for Dismissal', type: 'textarea', key: 'groundsForDismissal' },
    { label: 'Severance Pay', type: 'textarea', key: 'severancePay' },

    // Confidentiality & IP
    { label: 'Confidentiality Agreement', type: 'textarea', key: 'confidentialityAgreement' },
    { label: 'Intellectual Property Clause', type: 'textarea', key: 'intellectualPropertyClause' },

    // Restrictive Covenants
    { label: 'Non-Compete Clause', type: 'textarea', key: 'nonCompeteClause' },
    { label: 'Non-Solicitation Clause', type: 'textarea', key: 'nonSolicitationClause' },

    // Dispute Resolution
    { label: 'Dispute Resolution', type: 'text', key: 'disputeResolution' },
    { label: 'Jurisdiction', type: 'text', key: 'jurisdiction' }
  ]
}

export default contractTemplate
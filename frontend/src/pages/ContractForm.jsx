// Define read-only fields OUTSIDE component to prevent recreation on every render
// Only keep truly non-editable company information
const READ_ONLY_FIELDS = new Set([
  'employerName',
  'employerAddress',
  'workingHoursPerWeek',
  'workingHoursStart',
  'workingHoursEnd',
  'overtimePolicy',
  'annualLeaveDays',
  'sickLeavePolicy',
  'unpaidLeaveConditions'
])
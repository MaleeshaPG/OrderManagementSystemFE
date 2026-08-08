export const STATUS_ACTIVE = 0;
export const STATUS_INACTIVE = 1;

export const statusFilterOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const statusFormOptions = [
  { value: STATUS_ACTIVE, label: 'Active' },
  { value: STATUS_INACTIVE, label: 'Inactive' },
];

// Department specific status options (active vs deleted)
export const DEPT_STATUS_ACTIVE = 0;
export const DEPT_STATUS_DELETED = 1;

export const departmentStatusFormOptions = [
  { value: DEPT_STATUS_ACTIVE, label: 'Active' },
  { value: DEPT_STATUS_DELETED, label: 'Deleted' },
];

// Store regions
export const storeRegionOptions = [
  { value: 'all', label: 'All regions' },
  { value: 'North', label: 'North' },
  { value: 'South', label: 'South' },
  { value: 'Central', label: 'Central' },
];

// Item unit enums
export const baseUnitOptions = [
  { value: 0, label: 'Milliliter' },
  { value: 2, label: 'Meter' },
  { value: 3, label: 'Centimeter' },
  { value: 4, label: 'Inch' },
  { value: 5, label: 'Foot' },
  { value: 6, label: 'Yard' },
  { value: 7, label: 'Packet' },
  { value: 8, label: 'Box' },
  { value: 9, label: 'Dozen' },
  { value: 10, label: 'bottle' },
  { value: 11, label: 'Piece' },
];

export const unitOptions = [
  { value: 0, label: 'Piece' },
  { value: 1, label: 'kg' },
  { value: 2, label: 'g' },
  { value: 3, label: 'Litre' },
];

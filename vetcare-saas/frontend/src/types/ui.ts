import React from 'react';

// Common UI component props
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  'data-testid'?: string;
}

// Button variants and props
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: string;
}

// Input field props
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends BaseComponentProps {
  type?: InputType;
  size?: InputSize;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  label?: string;
  fullWidth?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

// Select/Dropdown props
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectProps extends BaseComponentProps {
  options: SelectOption[];
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  size?: InputSize;
  error?: string;
  helperText?: string;
  label?: string;
  fullWidth?: boolean;
  loading?: boolean;
  noOptionsMessage?: string;
  onChange?: (value: string | number | (string | number)[]) => void;
  onSearch?: (query: string) => void;
}

// Modal/Dialog props
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  loading?: boolean;
  centered?: boolean;
}

// Alert/Notification props
export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface AlertProps extends BaseComponentProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  dismissible?: boolean;
  icon?: React.ReactNode;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

// Table props
export interface TableColumn<T = any> {
  key: string;
  title: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: (a: T, b: T) => number;
  filter?: {
    type: 'text' | 'select' | 'date' | 'number';
    options?: SelectOption[];
  };
}

export interface TableProps<T = any> extends BaseComponentProps {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
    onChange: (page: number, pageSize: number) => void;
  };
  selection?: {
    type: 'checkbox' | 'radio';
    selectedKeys: (string | number)[];
    onChange: (selectedKeys: (string | number)[], selectedRows: T[]) => void;
  };
  expandable?: {
    expandedRowKeys: (string | number)[];
    onExpand: (expanded: boolean, record: T) => void;
    expandedRowRender: (record: T, index: number) => React.ReactNode;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  filters?: Record<string, any>;
  onFilter?: (filters: Record<string, any>) => void;
  rowKey?: string | ((record: T) => string);
  emptyText?: string;
  size?: 'sm' | 'md' | 'lg';
  bordered?: boolean;
  striped?: boolean;
  hover?: boolean;
}

// Card props
export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  loading?: boolean;
  bordered?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Badge props
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' | 'dark';

export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  dot?: boolean;
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  offset?: [number, number];
}

// Avatar props
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  shape?: 'circle' | 'square';
  fallback?: string;
  fallbackIcon?: React.ReactNode;
  badge?: {
    variant: BadgeVariant;
    count?: number;
    dot?: boolean;
  };
  onClick?: () => void;
}

// Tooltip props
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface TooltipProps extends BaseComponentProps {
  title: string;
  placement?: TooltipPlacement;
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  delay?: number;
  disabled?: boolean;
  arrow?: boolean;
}

// Loading/Spinner props
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps extends BaseComponentProps {
  size?: SpinnerSize;
  color?: string;
  thickness?: number;
  speed?: string;
}

// Progress props
export type ProgressVariant = 'linear' | 'circular';

export interface ProgressProps extends BaseComponentProps {
  variant?: ProgressVariant;
  value: number;
  max?: number;
  size?: SpinnerSize;
  color?: string;
  showValue?: boolean;
  striped?: boolean;
  animated?: boolean;
  thickness?: number;
}

// Drawer/Sidebar props
export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  placement?: DrawerPlacement;
  size?: ModalSize;
  title?: string;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

// Breadcrumb props
export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbProps extends BaseComponentProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
}

// Pagination props
export interface PaginationProps extends BaseComponentProps {
  current: number;
  total: number;
  pageSize: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
  disabled?: boolean;
  simple?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange: (page: number, pageSize: number) => void;
}

// Tab props
export interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  closable?: boolean;
}

export interface TabsProps extends BaseComponentProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'line' | 'card' | 'editable-card';
  position?: 'top' | 'bottom' | 'left' | 'right';
  centered?: boolean;
  onChange?: (activeKey: string) => void;
  onEdit?: (targetKey: string, action: 'add' | 'remove') => void;
}

// Switch/Toggle props
export interface SwitchProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}

// Checkbox props
export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  value?: string;
  name?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (checked: boolean) => void;
}

// Radio props
export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface RadioProps extends BaseComponentProps {
  options: RadioOption[];
  value?: string | number;
  defaultValue?: string | number;
  name?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  direction?: 'horizontal' | 'vertical';
  onChange?: (value: string | number) => void;
}

// Date picker props
export interface DatePickerProps extends BaseComponentProps {
  value?: Date | string;
  defaultValue?: Date | string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  format?: string;
  size?: InputSize;
  error?: string;
  helperText?: string;
  label?: string;
  fullWidth?: boolean;
  showTime?: boolean;
  range?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  onChange?: (date: Date | Date[] | null) => void;
}

// File upload props
export interface FileUploadProps extends BaseComponentProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  dragAndDrop?: boolean;
  showFileList?: boolean;
  preview?: boolean;
  customRequest?: (options: any) => void;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  onChange?: (fileList: File[]) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

// Theme and styling
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  light: string;
  dark: string;
  white: string;
  gray: Record<string, string>;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface ThemeBreakpoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface ThemeFonts {
  family: {
    sans: string;
    serif: string;
    mono: string;
  };
  size: Record<string, string>;
  weight: Record<string, number>;
  lineHeight: Record<string, number>;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  breakpoints: ThemeBreakpoints;
  fonts: ThemeFonts;
  shadows: Record<string, string>;
  borderRadius: Record<string, string>;
  zIndex: Record<string, number>;
}

// Layout props
export interface ContainerProps extends BaseComponentProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';
  centered?: boolean;
  fluid?: boolean;
  padding?: boolean;
}

export interface GridProps extends BaseComponentProps {
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  spacing?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

export interface FlexProps extends BaseComponentProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'stretch';
  gap?: number | string;
  flex?: number | string;
}
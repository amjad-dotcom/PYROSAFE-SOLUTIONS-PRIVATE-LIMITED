import { LineItem } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const calculateTax = (
  items: LineItem[],
  companyState: string,
  customerState: string
) => {
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0);
  const isIntraState = companyState.toLowerCase() === customerState.toLowerCase();

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  items.forEach((item) => {
    const itemTotal = item.qty * item.rate;
    const tax = (itemTotal * item.taxRate) / 100;

    if (isIntraState) {
      cgst += tax / 2;
      sgst += tax / 2;
    } else {
      igst += tax;
    }
  });

  return {
    subtotal,
    cgst,
    sgst,
    igst,
    total: subtotal + cgst + sgst + igst,
  };
};

export const generateInvoiceNumber = (lastNumber: string | null): string => {
  const prefix = 'INV';
  const year = new Date().getFullYear();
  if (!lastNumber) return `${prefix}-${year}-001`;
  
  const parts = lastNumber.split('-');
  const lastSeq = parseInt(parts[parts.length - 1], 10);
  const nextSeq = (lastSeq + 1).toString().padStart(3, '0');
  
  return `${prefix}-${year}-${nextSeq}`;
};

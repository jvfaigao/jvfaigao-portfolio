// "How it works" diagrams. Wide layout is a grid of 184×72 cards (col, row);
// edges must join neighbouring cards in the same row or column.
export interface DiagramNode {
  id: string;
  title: string;
  sub: string;
  col: number;
  row: number;
  hot?: boolean;
}

export interface Diagram {
  label: string;
  caption: string;
  nodes: DiagramNode[];
  edges: [from: string, to: string][];
  /** Phone layout, top to bottom; a step with two ids shows them side by side. */
  narrow: string[][];
}

export type DiagramKey = 'ja1' | 'marami' | 'urban' | 'degz' | 'faceattend' | 'ambagpay' | 'thesis';

export const diagrams: Record<DiagramKey, Diagram> = {
  marami: {
    label:
      'Online order goes to the POS. The POS sends food orders to the kitchen display and deducts inventory. Everything syncs to the cloud when online.',
    caption:
      "Every order goes through the POS first. Paid food orders reach the kitchen, ingredients are deducted from stock, and everything syncs to the cloud whenever the café's internet is up.",
    nodes: [
      { id: 'online', title: 'Online order', sub: "Customer's phone", col: 0, row: 0 },
      { id: 'pos', title: 'POS', sub: 'Café tablet', col: 1, row: 0, hot: true },
      { id: 'kitchen', title: 'Kitchen display', sub: 'Food orders', col: 2, row: 0 },
      { id: 'inv', title: 'Inventory', sub: 'Ingredients deducted', col: 1, row: 1 },
      { id: 'cloud', title: 'Cloud sync', sub: 'Supabase, when online', col: 2, row: 1 },
    ],
    edges: [['online', 'pos'], ['pos', 'kitchen'], ['pos', 'inv'], ['inv', 'cloud']],
    narrow: [['online'], ['pos'], ['kitchen', 'inv'], ['cloud']],
  },
  ja1: {
    label: "A member's QR code is scanned at the kiosk, which works offline. Attendance syncs to Firebase, and leaders see reports.",
    caption:
      'Each member has a QR code. A scan at the kiosk records attendance, even offline, and syncs to Firebase, where leaders see reports for their branch.',
    nodes: [
      { id: 'qr', title: 'Member QR code', sub: 'One per member', col: 0, row: 0 },
      { id: 'kiosk', title: 'Kiosk scanner', sub: 'Works offline', col: 1, row: 0, hot: true },
      { id: 'db', title: 'Firebase', sub: 'Members and attendance', col: 2, row: 0 },
      { id: 'reports', title: 'Reports', sub: 'Per branch', col: 2, row: 1 },
    ],
    edges: [['qr', 'kiosk'], ['kiosk', 'db'], ['db', 'reports']],
    narrow: [['qr'], ['kiosk'], ['db'], ['reports']],
  },
  urban: {
    label: "A worker's QR code is scanned at the site. The server checks the time and status, then payroll exports to CSV.",
    caption:
      'Workers scan in at the site. The server, not the phone, decides the time, status and pay, and payroll exports to CSV for accounting.',
    nodes: [
      { id: 'qr', title: 'Worker QR code', sub: 'One per worker', col: 0, row: 0 },
      { id: 'scan', title: 'Site scanner', sub: 'Phone, offline-ready', col: 1, row: 0, hot: true },
      { id: 'fn', title: 'Edge Function', sub: 'Checks time and status', col: 2, row: 0 },
      { id: 'pay', title: 'Payroll', sub: 'Sat–Fri, CSV export', col: 2, row: 1 },
    ],
    edges: [['qr', 'scan'], ['scan', 'fn'], ['fn', 'pay']],
    narrow: [['qr'], ['scan'], ['fn'], ['pay']],
  },
  degz: {
    label: 'A customer picks a slot and books it. The slot is held, the customer pays a GCash deposit, and staff confirm the payment.',
    caption:
      'A booking holds the slot so no one else can take it. The customer pays a GCash deposit, and staff confirm it before the booking is final.',
    nodes: [
      { id: 'cust', title: 'Customer', sub: 'Picks a court and time', col: 0, row: 0 },
      { id: 'book', title: 'Booking', sub: 'Slot held, no double-booking', col: 1, row: 0, hot: true },
      { id: 'gcash', title: 'GCash deposit', sub: 'Paid online', col: 2, row: 0 },
      { id: 'review', title: 'Staff review', sub: 'Booking confirmed', col: 2, row: 1 },
    ],
    edges: [['cust', 'book'], ['book', 'gcash'], ['gcash', 'review']],
    narrow: [['cust'], ['book'], ['gcash'], ['review']],
  },
  faceattend: {
    label: 'The camera sees a face. The face engine in the browser checks liveness and matches the face, then records attendance.',
    caption: 'The face check runs in the browser, and only face embeddings are stored, never photos.',
    nodes: [
      { id: 'cam', title: 'Camera', sub: "Student's face", col: 0, row: 0 },
      { id: 'engine', title: 'Face engine', sub: 'Runs in the browser', col: 1, row: 0, hot: true },
      { id: 'live', title: 'Liveness check', sub: 'Blocks photos and screens', col: 2, row: 0 },
      { id: 'rec', title: 'Attendance', sub: 'Recorded when matched', col: 2, row: 1 },
    ],
    edges: [['cam', 'engine'], ['engine', 'live'], ['live', 'rec']],
    narrow: [['cam'], ['engine'], ['live'], ['rec']],
  },
  ambagpay: {
    label:
      'Members pay into the AmbagVault smart contract. The treasurer uploads a receipt, the AI agent checks it and proposes the expense to the contract, and everything shows on the public ledger.',
    caption:
      'Money sits in the smart contract. The AI agent can only propose an expense; the contract enforces budgets and approvals, and every step shows on the public ledger.',
    nodes: [
      { id: 'pay', title: 'Member pays', sub: 'Google login, no gas', col: 0, row: 0 },
      { id: 'vault', title: 'AmbagVault', sub: 'Smart contract', col: 1, row: 0, hot: true },
      { id: 'ledger', title: 'Public ledger', sub: 'Receipts and BscScan', col: 2, row: 0 },
      { id: 'receipt', title: 'Treasurer', sub: 'Uploads a receipt', col: 0, row: 1 },
      { id: 'agent', title: 'AI Treasurer Agent', sub: 'Checks and proposes', col: 1, row: 1 },
    ],
    edges: [['pay', 'vault'], ['vault', 'ledger'], ['receipt', 'agent'], ['agent', 'vault']],
    narrow: [['pay', 'receipt'], ['agent'], ['vault'], ['ledger']],
  },
  thesis: {
    label: 'Employees, HR and accounting each use their own portal, and reports export to PDF and Excel.',
    caption: 'Each role signs in to its own portal. Reports and payslips export to PDF and Excel.',
    nodes: [
      { id: 'emp', title: 'Employee portal', sub: 'Own records', col: 0, row: 0 },
      { id: 'hr', title: 'HR portal', sub: 'Staff and attendance', col: 1, row: 0 },
      { id: 'acct', title: 'Accounting portal', sub: 'Payroll', col: 2, row: 0, hot: true },
      { id: 'rep', title: 'Reports', sub: 'PDF and Excel', col: 2, row: 1 },
    ],
    edges: [['emp', 'hr'], ['hr', 'acct'], ['acct', 'rep']],
    narrow: [['emp'], ['hr'], ['acct'], ['rep']],
  },
};

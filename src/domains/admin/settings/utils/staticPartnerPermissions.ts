import { ComponentType, createElement } from 'react';

import {
    ApartmentOutlined,
    AppstoreOutlined,
    AuditOutlined,
    BankOutlined,
    CreditCardOutlined,
    FileProtectOutlined,
    FileSyncOutlined,
    FileTextOutlined,
    GlobalOutlined,
    LineChartOutlined,
    MailOutlined,
    MessageOutlined,
    SafetyCertificateOutlined,
    ShopOutlined,
    SoundOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import { renderToStaticMarkup } from 'react-dom/server';


import AccountsIcon from '@assets/icons/Accounts.svg';
import BuildingIcon from '@assets/icons/building.svg';
import ConnectIcon from '@assets/icons/Connect.svg';
import CorporateCardIcon from '@assets/icons/CorporateCard.svg';
import DashboardIcon from '@assets/icons/Dashboard.svg';
import ESignIcon from '@assets/icons/ESign.svg';
import GiftCardsIcon from '@assets/icons/GiftCards.svg';
import HelpIcon from '@assets/icons/Help.svg';
import InsuranceIcon from '@assets/icons/Insurance.svg';
import InvoicingIcon from '@assets/icons/Invoicing.svg';
import LogisticsIcon from '@assets/icons/Logistics.svg';
import MobileRechargeIcon from '@assets/icons/MobileRecharge.svg';
import PaymentLinkIcon from '@assets/icons/PaymentLink.svg';
import PayrollIcon from '@assets/icons/Payroll.svg';
import PekoCloudIcon from '@assets/icons/pekocloud.svg';
import ProcureIcon from '@assets/icons/ProcureIcon.svg';
import ReportsIcon from '@assets/icons/Reports.svg';
import SettingsIcon from '@assets/icons/Settings.svg';
import SuppliesIcon from '@assets/icons/Supplies.svg';
import TaxIcon from '@assets/icons/Tax.svg';
import TravelIcon from '@assets/icons/Travel.svg';
import TurboIcon from '@assets/icons/Turbo.svg';
import UtilityIcon from '@assets/icons/Utility.svg';
import VendorPayoutsIcon from '@assets/icons/VendorPayouts.svg';
import VerificationSuiteIcon from '@assets/icons/VerificationSuite.svg';
import WhatsAppForBusinessIcon from '@assets/icons/WhatsAppForBusiness.svg';
import WorksIcon from '@assets/icons/Works.svg';
import ZeroCarbonIcon from '@assets/icons/ZeroCarbon.svg';

import { Permission } from '../types/partnerPermission';

/**
 * TEMPORARY static mock of the `user/services/partner-initial-sidebar` response,
 * used while the backend flattening is not yet implemented.
 *
 * Difference from the current API shape: the `"More Services"` wrapper node is
 * removed and its sub-services are promoted to **top-level** entries (each marked
 * `enableMoreService: true`). Every service also carries an `icon` and an explicit
 * `enableMoreService` flag (defaults to `false`).
 * Remove this file and switch back to `useUpdateRoles().permissionData` once the
 * backend returns the flattened shape.
 *
 * Icons: `icon` used to be a `${ICON_CDN}/name.svg` URL pointing at an internal CDN
 * (cdn.peko.one) that's unreachable from this standalone deployment, so every
 * sidebar icon failed to load. Every service below now resolves to either a
 * bundled local asset (imported above, from src/assets/icons/ — the same
 * convention SidebarData.tsx already uses for its own static nav items) or, where
 * no local asset is a clear match, an @ant-design/icons icon rendered to inline
 * SVG markup via iconMarkup() below. NavIconGlyph (nav-section/vertical/NavIcon.tsx)
 * is deliberately left untouched — it already knows how to render pasted SVG
 * markup inline via isSvgMarkup()/InlineSvg, so a real antd icon rendered to a
 * markup string flows through that exact same path rather than needing a new
 * "React component" branch there.
 */

// Renders an antd icon component to a standalone <svg>...</svg> markup string at
// module load, so it can sit in the same `icon: string` slot as a bundled asset
// path or pasted markup — see the file-level comment above for why.
const iconMarkup = (Icon: ComponentType): string => {
    const rendered = renderToStaticMarkup(createElement(Icon));
    return rendered.match(/<svg[\s\S]*<\/svg>/)?.[0] ?? rendered;
};

export const staticPartnerPermissions: Permission[] = [
    {
        label: 'Dashboard',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: DashboardIcon,
    },
    {
        label: 'Accounting',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: AccountsIcon,
    },
    {
        label: 'Mobile Recharge & Bills',
        hasAccess: false,
        enableMoreService: false,
        icon: MobileRechargeIcon,
        subServices: [
            { label: 'Prepaid', hasAccess: false },
            { label: 'Postpaid', hasAccess: false },
            { label: 'Test', hasAccess: false },
        ],
    },
    {
        label: 'Utility Payments',
        hasAccess: false,
        enableMoreService: false,
        icon: UtilityIcon,
        subServices: [
            { label: 'Electricity Bill', hasAccess: false },
            { label: 'Broadband Bill', hasAccess: false },
            { label: 'LPG Cylinder', hasAccess: false },
            { label: 'Water Bill', hasAccess: false },
            { label: 'Landline Bill', hasAccess: false },
            { label: 'Piped Gas', hasAccess: false },
            { label: 'Education Fee', hasAccess: false },
            { label: 'Insurance', hasAccess: false },
            { label: 'Cable Recharge', hasAccess: false },
            { label: 'DTH Recharge', hasAccess: false },
            { label: 'FASTag Recharge', hasAccess: false },
            { label: 'Traffic Challan', hasAccess: false },
            { label: 'Clubs & Associations', hasAccess: false },
            { label: 'Hospital & Pathology', hasAccess: false },
            { label: 'Subscription', hasAccess: false },
            { label: 'NCMC', hasAccess: false },
            { label: 'NPS', hasAccess: false },
            { label: 'Prepaid Meter', hasAccess: false },
            { label: 'Life Insurance', hasAccess: false },
            { label: 'Bike Insurance', hasAccess: false },
            { label: 'Car Insurance', hasAccess: false },
            { label: 'Credit Card Payment', hasAccess: false },
            { label: 'Loan Repayment', hasAccess: false },
            { label: 'Municipal Taxes', hasAccess: false },
            { label: 'Municipal Services', hasAccess: false },
            { label: 'Recurring Deposite', hasAccess: false },
            { label: 'Rental', hasAccess: false },
            { label: 'Donations', hasAccess: false },
            { label: 'Housing Society', hasAccess: false },
            { label: 'Complaint Registration', hasAccess: false },
        ],
    },
    {
        label: 'Corporate Travel',
        hasAccess: false,
        enableMoreService: false,
        icon: TravelIcon,
        subServices: [
            { label: 'airline', hasAccess: false },
            { label: 'hotels', hasAccess: false },
            { label: 'eSIM', hasAccess: false },
        ],
    },
    {
        label: 'Payroll',
        accessKey: 'peko_payroll',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: PayrollIcon,
    },
    {
        label: 'Office Supplies',
        accessKey: 'ecommerce',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: SuppliesIcon,
    },
    {
        label: 'Domain & Hosting',
        accessKey: 'domain_and_hosting',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(GlobalOutlined),
    },
    {
        label: 'Turbo',
        accessKey: 'peko_garage',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: TurboIcon,
    },
    {
        label: 'eSign',
        accessKey: 'signDrive_eSign',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: ESignIcon,
    },
    {
        label: 'Verification Suite',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: VerificationSuiteIcon,
    },
    {
        label: 'Peko Wallet',
        accessKey: 'peko_wallet',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(WalletOutlined),
    },
    {
        label: 'Company Incorporation',
        accessKey: 'company_incorporation',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(ApartmentOutlined),
    },
    {
        label: 'Business Registration',
        accessKey: 'business_registration',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(FileProtectOutlined),
    },
    {
        label: 'Global Business Setup',
        accessKey: 'global_business_setup',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(GlobalOutlined),
    },
    {
        label: 'Compliance',
        accessKey: 'compliance',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(SafetyCertificateOutlined),
    },
    {
        label: 'Procure',
        accessKey: 'procure',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: ProcureIcon,
    },
    {
        label: 'Payouts',
        accessKey: 'vendor_payouts',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: VendorPayoutsIcon,
    },
    {
        label: 'Payment Links',
        accessKey: 'quick_links',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: PaymentLinkIcon,
    },
    {
        label: 'Document Attestation',
        accessKey: 'document_attestation',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(AuditOutlined),
    },
    {
        label: 'Business Docs',
        accessKey: 'edocs',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(FileTextOutlined),
    },
    {
        label: 'Office Address',
        accessKey: 'workspace',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: BuildingIcon,
    },
    {
        label: 'Soundbox',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(SoundOutlined),
    },
    {
        label: 'Paytm BPOS',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(CreditCardOutlined),
    },
    {
        label: 'License Renewal',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(FileSyncOutlined),
    },
    {
        label: 'Works',
        accessKey: 'peko_works',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: WorksIcon,
    },
    {
        label: 'Zero Carbon',
        accessKey: 'carbon_footprint',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: ZeroCarbonIcon,
    },
    {
        label: 'Connect',
        accessKey: 'peko_connect',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: ConnectIcon,
    },
    {
        label: 'ESR',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(FileTextOutlined),
    },
    {
        label: 'Hike',
        accessKey: 'hike_service',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(MessageOutlined),
    },
    {
        label: 'Business Emails',
        accessKey: 'email_domain_service',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(MailOutlined),
    },
    {
        label: 'Government Services',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(BankOutlined),
    },
    {
        label: 'Logistics',
        accessKey: 'shipment_services',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: LogisticsIcon,
    },
    {
        label: 'Legal Service',
        accessKey: 'legal_service',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(AuditOutlined),
    },
    {
        label: 'Softwares',
        accessKey: 'subscription_payments',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(AppstoreOutlined),
    },
    {
        label: 'Gift Cards',
        accessKey: 'quickcilver',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: GiftCardsIcon,
    },
    {
        label: 'Marketplace',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(ShopOutlined),
    },
    {
        label: 'Tax & More',
        hasAccess: false,
        enableMoreService: false,
        icon: TaxIcon,
        subServices: [
            { label: 'GST Filing', hasAccess: false },
            { label: 'TDS Filing', hasAccess: false },
        ],
    },
    {
        label: 'Invoicing',
        accessKey: 'invoices',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: InvoicingIcon,
    },
    {
        label: 'Insurance',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: InsuranceIcon,
    },
    {
        label: 'WhatsApp for Business',
        accessKey: 'whatsApp_for_busines',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: WhatsAppForBusinessIcon,
    },
    {
        label: 'Corporate Cards',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: CorporateCardIcon,
    },
    {
        label: 'Hub',
        accessKey: 'pekoCloud',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: PekoCloudIcon,
    },
    {
        label: 'Sales',
        accessKey: 'sales',
        hasAccess: false,
        subServices: [],
        enableMoreService: false,
        icon: iconMarkup(LineChartOutlined),
    },
    {
        label: 'Reports',
        hasAccess: false,
        enableMoreService: false,
        icon: ReportsIcon,
        subServices: [
            { label: 'Transactions', hasAccess: false },
            { label: 'Cashbacks', hasAccess: false },
            { label: 'Scheduling Reports', hasAccess: false },
            { label: 'Subscription Transactions', hasAccess: false },
        ],
    },
    {
        label: 'Need Help',
        hasAccess: false,
        enableMoreService: false,
        icon: HelpIcon,
        subServices: [
            { label: 'Contact Us', hasAccess: false },
            { label: 'Tickets', hasAccess: false },
            { label: 'Frequently Asked Questions', hasAccess: false },
        ],
    },
    {
        label: 'Settings',
        hasAccess: false,
        enableMoreService: false,
        icon: SettingsIcon,
        subServices: [
            { label: 'User Management', hasAccess: false },
            { label: 'Billing & Saved Cards', hasAccess: false },
            { label: 'Subscription Plans', hasAccess: false },
            { label: 'Security', hasAccess: false },
            { label: 'Connected Apps', hasAccess: false },
        ],
    },
];

export default staticPartnerPermissions;

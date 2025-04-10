#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, log, symbol_short, Env, Map, String,
    Symbol, Vec,
};

const INVOICE_MAP: Symbol = symbol_short!("MAP");
const INVOICE_HISTORY_MAP: Symbol = symbol_short!("HISTORY");

#[contracttype]
#[derive(Clone)]
pub struct Track {
    pub subject: String,
    pub status: String,
    pub msg_id: String,
    pub api_key_id: String,
    pub event: String,
    pub to: String,
}
#[contracterror]
#[derive( Clone)]
pub enum InvoiceError {
    NotFound = 4004,
    InvoiceAlreadyExists = 1002,
    InvoiceNotAcknowledged = 1003,
    InvoiceAlreadyDeleted = 1004,
    AlreadyFinanced=1005,
    InvoiceAcknowledged = 2001,
    InvoiceFinanced = 2002,
    InvoicePaid = 2003,
    InvoiceRejected = 2004,
    InvoiceVoided = 2005,
    InvoicePaymentConfirmed = 2006,
    InvalidInput = 304,
}

#[contracttype]
#[derive(Clone)]
pub struct Invoice {
    pub inv_type: String,
    pub vendor_id: String,
    pub mongo_id: String,
    pub creation_date: String,
    pub vendor_email: String,
    pub action: String,
    pub ack: bool,
    pub finance: bool,
    pub financing_details: Vec<String>,
    pub vendor_email_hash: String,
    pub vendor_mobile_hash: String,
    pub vendor_mobile: String,
    pub client_fname: String,
    pub client_lname: String,
    pub vendor_name: String,
    pub client_email: String,
    pub client_mobile: String,
    pub currency: String,
    pub fund_reception: String,
    pub lines: String,
    pub net_amt: String,
    pub paid: bool,
    pub rejected: bool,
    pub voided: bool,
    pub sent_invoice_deleted: bool,
    pub received_invoice_deleted: bool,
    pub timestamp: u64,
    pub previous_invoice_hash: String,
    pub txn_hash: String,
    pub due_date: String,
    pub deleted_comments: String,
    pub payment_confirmation: bool,
    pub tracking: Track,
}

#[contract]
pub struct InvoiceContract;

#[contractimpl]
impl InvoiceContract {
    fn get_invoice_storage(env: &Env) -> Map<String, Invoice> {
        env.storage()
            .instance()
            .get(&INVOICE_MAP)
            .unwrap_or(Map::new(env))
    }

    fn get_history_storage(env: &Env) -> Map<String, Vec<Invoice>> {
        env.storage()
            .instance()
            .get(&INVOICE_HISTORY_MAP)
            .unwrap_or(Map::new(env))
    }
    /// Save the invoice map back to storage
    fn save_invoice_storage(env: &Env, storage_map: &Map<String, Invoice>) {
        env.storage().instance().set(&INVOICE_MAP, storage_map);
        env.storage().instance().extend_ttl(1000, 5000);
    }

    fn save_history_storage(env: &Env, invoice: Invoice) {
        let mongo_id = invoice.mongo_id.clone(); 
        let mut history_state = Self::get_history_storage(env);

        let mut history = history_state.get(mongo_id.clone()).unwrap_or(Vec::new(env));

        history.push_back(invoice.clone());

        history_state.set(mongo_id.clone(), history);

        env.storage()
            .instance()
            .set(&INVOICE_HISTORY_MAP, &history_state);

        env.storage().instance().extend_ttl(1000, 5000);
    }

    fn check_invoice_status(
        invoice: Invoice,
        ack: bool,
        finance: bool,
        paid: bool,
        reject: bool,
        void: bool,
        confirm: bool,
        finance_check: bool,
        ack_check: bool,
        paid_check: bool,
    ) -> Option<InvoiceError> {
        if ack_check != true {
            if invoice.ack != ack {
                return Some(InvoiceError::InvoiceAcknowledged);
            }
        }
        if finance_check != true {
            if invoice.finance != finance {
                return Some(InvoiceError::InvoiceFinanced);
            }
        }
        if paid_check != true {}
        {
            if invoice.paid != paid {
                return Some(InvoiceError::InvoicePaid);
            }
        }
        if invoice.rejected != reject {
            return Some(InvoiceError::InvoiceRejected);
        }
        if invoice.voided != void {
            return Some(InvoiceError::InvoiceVoided);
        }
        if invoice.payment_confirmation != confirm {
            return Some(InvoiceError::InvoicePaymentConfirmed);
        }
        None
    }

    /// Add or update an invoice
    pub fn create_invoice(env: Env, invoice_input: Invoice) -> Result<String, InvoiceError> {
        if invoice_input.mongo_id.is_empty()
            || invoice_input.vendor_id.is_empty()
            || invoice_input.action.is_empty()
            || invoice_input.creation_date.is_empty()
            || invoice_input.vendor_email.is_empty()
            || invoice_input.vendor_email_hash.is_empty()
            || invoice_input.vendor_mobile_hash.is_empty()
            || invoice_input.vendor_mobile.is_empty()
            || invoice_input.client_fname.is_empty()
            || invoice_input.client_lname.is_empty()
            || invoice_input.vendor_name.is_empty()
            || invoice_input.client_email.is_empty()
            || invoice_input.client_mobile.is_empty()
            || invoice_input.currency.is_empty()
            || invoice_input.fund_reception.is_empty()
            || invoice_input.lines.is_empty()
            || invoice_input.net_amt.is_empty()
            || invoice_input.txn_hash.is_empty()
            || invoice_input.due_date.is_empty()
        {
            log!(&env, "Error: One or more input fields are empty");
            return Err(InvoiceError::InvalidInput);
        }
        let mut state = Self::get_invoice_storage(&env);

        if state.contains_key(invoice_input.mongo_id.clone()) {
            log!(
                &env,
                "Error: Invoice with mongo_id {} already exists",
                invoice_input.mongo_id
            );
            return Err(InvoiceError::InvoiceAlreadyExists);
        }

        let invoice = Invoice {
            mongo_id: invoice_input.mongo_id,
            inv_type: String::from_str(&env, "Invoice"),
            vendor_id: invoice_input.vendor_id,
            creation_date: invoice_input.creation_date,
            vendor_email: invoice_input.vendor_email,
            action: invoice_input.action,
            ack: false,
            finance: false,
            financing_details: Vec::new(&env),
            vendor_email_hash: invoice_input.vendor_email_hash,
            vendor_mobile_hash: invoice_input.vendor_mobile_hash,
            vendor_mobile: invoice_input.vendor_mobile,
            client_fname: invoice_input.client_fname,
            client_lname: invoice_input.client_lname,
            vendor_name: invoice_input.vendor_name,
            client_email: invoice_input.client_email,
            client_mobile: invoice_input.client_mobile,
            currency: invoice_input.currency,
            fund_reception: invoice_input.fund_reception,
            lines: invoice_input.lines,
            net_amt: invoice_input.net_amt,
            paid: false,
            rejected: false,
            voided: false,
            sent_invoice_deleted: false,
            received_invoice_deleted: false,
            // timestamp: invoice_input.timestamp,
            timestamp: env.ledger().timestamp(),
            previous_invoice_hash: String::from_str(&env, ""),
            txn_hash: invoice_input.txn_hash,
            due_date: invoice_input.due_date,
            deleted_comments: String::from_str(&env, ""),
            payment_confirmation: false,
            tracking: Track {
                subject: String::from_str(&env, ""),
                status: String::from_str(&env, ""),
                msg_id: String::from_str(&env, ""),
                api_key_id: String::from_str(&env, ""),
                event: String::from_str(&env, ""),
                to: String::from_str(&env, ""),
            },
        };

        state.set(invoice.mongo_id.clone(), invoice.clone());

        Self::save_invoice_storage(&env, &state);
        Self::save_history_storage(&env, invoice.clone());

        log!(&env, "Invoice with mongo_id {} created", invoice.mongo_id);
        env.events()
            .publish((symbol_short!("Created"),), invoice.mongo_id.clone());
        return Ok(String::from_str(&env, "Invoice created"));
    }

    /// Acknowledge an invoice
    pub fn ack_invoice(
        env: Env,
        mongo_id: String,
        action: String,
        txn_hash: String,
    ) -> Result<String, InvoiceError> {
        if mongo_id.is_empty() || action.is_empty() || txn_hash.is_empty() {
            log!(&env, "Error: One or more input fields are empty");
            return Err(InvoiceError::InvalidInput);
        }
        let mut state = Self::get_invoice_storage(&env);

        if let Some(mut invoice) = state.get(mongo_id.clone()) {
           

            if let Some(error) = Self::check_invoice_status(
                invoice.clone(),
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
            ) {
                return Err(error);
            }

            invoice.action = action;
            invoice.ack = true;
            invoice.previous_invoice_hash = invoice.txn_hash.clone();
            invoice.txn_hash = txn_hash;
            // invoice.timestamp=timestamp;
            invoice.timestamp = env.ledger().timestamp();

            state.set(mongo_id.clone(), invoice.clone());
            Self::save_invoice_storage(&env, &state);
            Self::save_history_storage(&env, invoice);

            log!(&env, "Invoice {} acknowledged and updated", mongo_id);
            env.events()
                .publish((symbol_short!("Ack"),), mongo_id.clone());
            return Ok(String::from_str(&env, "Invoice acknowledged and updated"));
        }

        log!(&env, "Invoice {} not found", mongo_id);

        return Err(InvoiceError::NotFound);
    }

    /// Paid an invoice
    pub fn paid_invoice(
        env: Env,
        mongo_id: String,
        action: String,
        txn_hash: String,
    ) -> Result<String, InvoiceError> {
        if mongo_id.is_empty() || action.is_empty() || txn_hash.is_empty()  {
            log!(&env, "Error: One or more input fields are empty");
            return Err(InvoiceError::InvalidInput);
        }
        let mut state = Self::get_invoice_storage(&env);

        if let Some(mut invoice) = state.get(mongo_id.clone()) {
            if let Some(error) = Self::check_invoice_status(
                invoice.clone(),
                true,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
            ) {
                return Err(error);
            }

            invoice.action = action;
            invoice.paid = true;
            invoice.ack = true;
            invoice.previous_invoice_hash = invoice.txn_hash.clone();
            invoice.txn_hash = txn_hash;
            // invoice.timestamp=timestamp;
            invoice.timestamp = env.ledger().timestamp();

            state.set(mongo_id.clone(), invoice.clone());
            Self::save_invoice_storage(&env, &state);
            Self::save_history_storage(&env, invoice);

            log!(&env, "Invoice {} paid and updated", mongo_id);
            env.events()
                .publish((symbol_short!("Paid"),), mongo_id.clone());
            return Ok(String::from_str(&env, "Invoice paid and updated"));
        }

        log!(&env, "Invoice {} not found", mongo_id);
        Err(InvoiceError::NotFound)
    }

    /// Reject an invoice
    pub fn reject_invoice(
        env: Env,
        mongo_id: String,
        action: String,
        txn_hash: String,
    ) -> Result<String, InvoiceError> {
        if mongo_id.is_empty() || action.is_empty() || txn_hash.is_empty() {
            log!(&env, "Error: One or more input fields are empty");
            return Err(InvoiceError::InvalidInput);
        }
        let mut state = Self::get_invoice_storage(&env);

        if let Some(mut invoice) = state.get(mongo_id.clone()) {
            if let Some(error) = Self::check_invoice_status(
                invoice.clone(),
                true,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
            ) {
                return Err(error);
            }

            invoice.action = action;
            invoice.rejected = true;
            invoice.previous_invoice_hash = invoice.txn_hash.clone();
            invoice.txn_hash = txn_hash;
            // invoice.timestamp=timestamp;
            invoice.timestamp = env.ledger().timestamp();

            state.set(mongo_id.clone(), invoice.clone());
            Self::save_invoice_storage(&env, &state);
            Self::save_history_storage(&env, invoice);

            log!(&env, "Invoice {} rejected and updated", mongo_id);
            env.events()
                .publish((symbol_short!("Rejected"),), mongo_id.clone());
            return Ok(String::from_str(&env, "Invoice rejected and updated"));
        }

        log!(&env, "Invoice {} not found", mongo_id);
        Err(InvoiceError::NotFound)
    }

    /// Void an invoice
    pub fn void_invoice(
        env: Env,
        mongo_id: String,
        action: String,
        txn_hash: String,
    ) -> Result<String, InvoiceError> {
        if mongo_id.is_empty() || action.is_empty() || txn_hash.is_empty(){
            log!(&env, "Error: One or more input fields are empty");
            return Err(InvoiceError::InvalidInput);
        }
        let mut state = Self::get_invoice_storage(&env);

        if let Some(mut invoice) = state.get(mongo_id.clone()) {
            if let Some(error) = Self::check_invoice_status(
                invoice.clone(),
                true,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
            ) {
                return Err(error);
            }
            invoice.action = action;
            invoice.voided = true;
            invoice.previous_invoice_hash = invoice.txn_hash.clone();
            invoice.txn_hash = txn_hash;
            // invoice.timestamp=timestamp;
            invoice.timestamp = env.ledger().timestamp();

            state.set(mongo_id.clone(), invoice.clone());
            Self::save_invoice_storage(&env, &state);
            Self::save_history_storage(&env, invoice);

            log!(&env, "Invoice {} voided and updated", mongo_id);
            env.events()
                .publish((symbol_short!("Voided"),), mongo_id.clone());
            return Ok(String::from_str(&env, "Invoice voided and updated"));
        }

        log!(&env, "Invoice {} not found", mongo_id);
        Err(InvoiceError::NotFound)
    }

    /// Finance an invoice
    pub fn finance_invoice(
        env: Env,
        mongo_id: String,
        finance_id: String,
        action: String,
        txn_hash: String,
    ) -> Result<String, InvoiceError> {
        if mongo_id.is_empty() || action.is_empty() || finance_id.is_empty() || txn_hash.is_empty()
        {
            log!(&env, "Error: One or more input fields are empty");
            return Err(InvoiceError::InvalidInput);
        }
        let mut state = Self::get_invoice_storage(&env);

        if let Some(mut invoice) = state.get(mongo_id.clone()) {
        
            if let Some(error) = Self::check_invoice_status(
                invoice.clone(),
                true,
                false,
                false,
                false,
                false,
                false,
                true,
                false,
                false,
            ) {
                return Err(error);
            }

            let finance_len= invoice.financing_details.len();
            for i in 0..finance_len {
                let key = invoice.financing_details.get(i).unwrap(); 
                if key==finance_id {
                    log!(&env, "Duplicate finance_id {} for invoice {}", finance_id, mongo_id);
                    return Err(InvoiceError::AlreadyFinanced);
                }
            }

            invoice.action = action;
            invoice.finance = true;
            invoice.financing_details.push_back(finance_id);
            invoice.previous_invoice_hash = invoice.txn_hash.clone();
            invoice.txn_hash = txn_hash;
            // invoice.timestamp=timestamp;
            invoice.timestamp = env.ledger().timestamp();

            state.set(mongo_id.clone(), invoice.clone());
            Self::save_invoice_storage(&env, &state);
            Self::save_history_storage(&env, invoice);

            log!(&env, "Invoice {} finance request initiated", mongo_id);
            env.events()
                .publish((symbol_short!("Finance"),), mongo_id.clone());
            return Ok(String::from_str(&env, "Invoice finance request initiated"));
        }

        log!(&env, "Invoice {} not found", mongo_id);
        Err(InvoiceError::NotFound)
    }

    /// Payment Confirmation an invoice
    pub fn payment_confirmation_invoice(
        env: Env,
        mongo_id: String,
        action: String,
        txn_hash: String,
    ) -> Result<String, InvoiceError> {
        if mongo_id.is_empty() || action.is_empty() || txn_hash.is_empty(){
            log!(&env, "Error: One or more input fields are empty");
            return Err(InvoiceError::InvalidInput);
        }
        let mut state = Self::get_invoice_storage(&env);

        if let Some(mut invoice) = state.get(mongo_id.clone()) {
            if let Some(error) = Self::check_invoice_status(
                invoice.clone(),
                true,
                true,
                true,
                false,
                false,
                false,
                true,
                true,
                true,
            ) {
                return Err(error);
            }

            invoice.action = action;
            invoice.paid = true;
            invoice.payment_confirmation = true;
            invoice.previous_invoice_hash = invoice.txn_hash.clone();
            invoice.txn_hash = txn_hash;
            // invoice.timestamp=timestamp;
            invoice.timestamp = env.ledger().timestamp();

            state.set(mongo_id.clone(), invoice.clone());
            Self::save_invoice_storage(&env, &state);
            Self::save_history_storage(&env, invoice);

            log!(
                &env,
                "Invoice {} payment confirmation and updated",
                mongo_id
            );
            env.events()
                .publish((symbol_short!("Payment"),), mongo_id.clone());
            return Ok(String::from_str(
                &env,
                "Invoice payment confirmation and updated",
            ));
        }

        log!(&env, "Invoice {} not found", mongo_id);
        Err(InvoiceError::NotFound)
    }

    ///  Update Tracking an invoice
    pub fn update_invoice_tracking(
        env: Env,
        mongo_id: String,
        subject: String,
        status: String,
        msg_id: String,
        api_key_id: String,
        event: String,
        to: String,
    ) -> Result<String, InvoiceError> {
        if mongo_id.is_empty() || event.is_empty() {
            log!(&env, "Error: One or more input fields are empty");
            return Err(InvoiceError::InvalidInput);
        }
        let mut state = Self::get_invoice_storage(&env);

        if let Some(mut invoice) = state.get(mongo_id.clone()) {
            invoice.tracking = Track {
                subject: subject,
                status: status,
                api_key_id: api_key_id,
                event: event,
                msg_id: msg_id,
                to: to,
            };

            state.set(mongo_id.clone(), invoice.clone());
            Self::save_invoice_storage(&env, &state);
            Self::save_history_storage(&env, invoice);

            log!(&env, "Invoice {} tracking updated", mongo_id);
            env.events()
                .publish((symbol_short!("Track"),), mongo_id.clone());
            return Ok(String::from_str(&env, "Invoice tracking updated"));
        }

        log!(&env, "Invoice {} not found", mongo_id);
        Err(InvoiceError::NotFound)
    }

    /// Retrieve invoice data
    pub fn query_invoice(env: Env, mongo_id: String) -> Result<Invoice,InvoiceError> {
        let state = Self::get_invoice_storage(&env);
        if let Some(invoice) = state.get(mongo_id) {
            return Ok(invoice);
        }
        return Err(InvoiceError::NotFound)
    }

    pub fn query_all_invoices(env: Env) -> Result<Vec<Invoice>, InvoiceError> {
        let state = Self::get_invoice_storage(&env);
        let mut invoices = Vec::new(&env);

        let keys_vec = state.keys(); 

        let len = keys_vec.len();

        for i in 0..len {
            let key = keys_vec.get(i).unwrap(); 
            if let Some(invoice) = state.get(key) {
                invoices.push_back(invoice);
            }
        }

        if invoices.is_empty() {
            return Err(InvoiceError::NotFound);
        }
        Ok(invoices)
    }

    pub fn query_invoice_history(env: Env, mongo_id: String) -> Result<Vec<Invoice>, InvoiceError> {
        let history_state = Self::get_history_storage(&env);

        if let Some(history) = history_state.get(mongo_id) {
            return Ok(history);
        }

        return Err(InvoiceError::NotFound);
    }

    pub fn query_by_txnhash(env: Env, txn_hash: String) -> Result<Vec<Invoice>, InvoiceError> {
        let state = Self::get_invoice_storage(&env);
        let mut matched_invoices = Vec::new(&env);

        let keys_vec = state.keys(); 
        let len = keys_vec.len();

        for i in 0..len {
            let key = keys_vec.get(i).unwrap(); 
            if let Some(invoice) = state.get(key) {
                if invoice.txn_hash == txn_hash {
                    matched_invoices.push_back(invoice);
                }
            }
        }

        if matched_invoices.is_empty() {
            return Err(InvoiceError::NotFound);
        }

        return Ok(matched_invoices);
    }
    

    pub fn query_by_vendor_emailhash(
        env: Env,
        email_hash: String,
    ) -> Result<Vec<Invoice>, InvoiceError> {
        let state = Self::get_invoice_storage(&env);
        let mut matched_invoices = Vec::new(&env);

        let keys_vec = state.keys(); 
        let len = keys_vec.len();

        for i in 0..len {
            let key = keys_vec.get(i).unwrap(); 
            if let Some(invoice) = state.get(key) {
                if invoice.vendor_email_hash == email_hash {
                    matched_invoices.push_back(invoice);
                }
            }
        }

        if matched_invoices.is_empty() {
            return Err(InvoiceError::NotFound);
        }

        return Ok(matched_invoices);
    }

    pub fn query_by_vendor_mobilehash(
        env: Env,
        mobile_hash: String,
    ) -> Result<Vec<Invoice>, InvoiceError> {
        let state = Self::get_invoice_storage(&env);
        let mut matched_invoices = Vec::new(&env);

        let keys_vec = state.keys(); 
        let len = keys_vec.len();

        for i in 0..len {
            let key = keys_vec.get(i).unwrap(); 
            if let Some(invoice) = state.get(key) {
                if invoice.vendor_mobile_hash == mobile_hash {
                    matched_invoices.push_back(invoice);
                }
            }
        }

        if matched_invoices.is_empty() {
            return Err(InvoiceError::NotFound);
        }

        return Ok(matched_invoices);
    }

    pub fn query_total_invoice_count(env: Env) -> u32 {
        let state = Self::get_invoice_storage(&env);
        state.keys().len() as u32
    }
}

mod test;

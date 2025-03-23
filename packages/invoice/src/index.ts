import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCLIMOMCYMWAA4ZRYDAE7KMLQ2XPROBU65CTD4UNU2BZOZFCNX6DKDTJ",
  }
} as const


export interface Track {
  api_key_id: string;
  event: string;
  msg_id: string;
  status: string;
  subject: string;
  to: string;
}

export const Errors = {
  1001: {message:"InvoiceNotFound"},

  1002: {message:"InvoiceAlreadyExists"},

  1003: {message:"InvoiceNotAcknowledged"},

  1004: {message:"InvoiceAlreadyDeleted"},

  2001: {message:"InvoiceAcknowledged"},

  2002: {message:"InvoiceFinanced"},

  2003: {message:"InvoicePaid"},

  2004: {message:"InvoiceRejected"},

  2005: {message:"InvoiceVoided"},

  2006: {message:"InvoicePaymentConfirmed"},

  3001: {message:"InvalidInvoiceInput"},

  3002: {message:"InvalidMongoId"},

  3003: {message:"InvalidAction"},

  3004: {message:"InvalidTxnHash"},

  3005: {message:"InvalidFinanceId"},

  3006: {message:"InvalidVendorEmail"},

  3007: {message:"InvalidClientEmail"},

  3008: {message:"InvalidVendorMobile"},

  3009: {message:"InvalidClientMobile"},

  3010: {message:"InvalidCurrency"},

  3011: {message:"InvalidFundReception"},

  3012: {message:"InvalidLines"},

  3013: {message:"InvalidNetAmount"},

  3014: {message:"InvalidDueDate"}
}

export interface Invoice {
  ack: boolean;
  action: string;
  client_email: string;
  client_fname: string;
  client_lname: string;
  client_mobile: string;
  creation_date: string;
  currency: string;
  deleted_comments: string;
  due_date: string;
  finance: boolean;
  financing_details: Array<string>;
  fund_reception: string;
  inv_type: string;
  lines: string;
  mongo_id: string;
  net_amt: string;
  paid: boolean;
  payment_confirmation: boolean;
  previous_invoice_hash: string;
  received_invoice_deleted: boolean;
  rejected: boolean;
  sent_invoice_deleted: boolean;
  tracking: Track;
  txn_hash: string;
  vendor_email: string;
  vendor_email_hash: string;
  vendor_id: string;
  vendor_mobile: string;
  vendor_mobile_hash: string;
  vendor_name: string;
  voided: boolean;
}


export interface Client {
  /**
   * Construct and simulate a create_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Add or update an invoice
   */
  create_invoice: ({invoice_input}: {invoice_input: Invoice}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a ack_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Acknowledge an invoice
   */
  ack_invoice: ({mongo_id, action, txn_hash}: {mongo_id: string, action: string, txn_hash: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a paid_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Paid an invoice
   */
  paid_invoice: ({mongo_id, action, txn_hash}: {mongo_id: string, action: string, txn_hash: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a reject_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Reject an invoice
   */
  reject_invoice: ({mongo_id, action, txn_hash}: {mongo_id: string, action: string, txn_hash: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a void_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Void an invoice
   */
  void_invoice: ({mongo_id, action, txn_hash}: {mongo_id: string, action: string, txn_hash: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a finance_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Finance an invoice
   */
  finance_invoice: ({mongo_id, finance_id, action, txn_hash}: {mongo_id: string, finance_id: string, action: string, txn_hash: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a payment_confirmation_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Payment Confirmation an invoice
   */
  payment_confirmation_invoice: ({mongo_id, action, txn_hash}: {mongo_id: string, action: string, txn_hash: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a update_invoice_tracking transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update Tracking an invoice
   */
  update_invoice_tracking: ({mongo_id, subject, status, msg_id, api_key_id, event, to}: {mongo_id: string, subject: string, status: string, msg_id: string, api_key_id: string, event: string, to: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<string>>>

  /**
   * Construct and simulate a query_invoice transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Retrieve invoice data
   */
  query_invoice: ({mongo_id}: {mongo_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<Invoice>>>

  /**
   * Construct and simulate a query_all_invoices transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_all_invoices: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Invoice>>>

  /**
   * Construct and simulate a query_invoice_history transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_invoice_history: ({mongo_id}: {mongo_id: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Invoice>>>

  /**
   * Construct and simulate a query_by_txnhash transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_by_txnhash: ({txn_hash}: {txn_hash: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Invoice>>>

  /**
   * Construct and simulate a query_by_vendor_emailhash transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_by_vendor_emailhash: ({email_hash}: {email_hash: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Invoice>>>

  /**
   * Construct and simulate a query_by_vendor_mobilehash transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_by_vendor_mobilehash: ({mobile_hash}: {mobile_hash: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Invoice>>>

  /**
   * Construct and simulate a query_total_invoice_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  query_total_invoice_count: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initalizing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAABVRyYWNrAAAAAAAABgAAAAAAAAAKYXBpX2tleV9pZAAAAAAAEAAAAAAAAAAFZXZlbnQAAAAAAAAQAAAAAAAAAAZtc2dfaWQAAAAAABAAAAAAAAAABnN0YXR1cwAAAAAAEAAAAAAAAAAHc3ViamVjdAAAAAAQAAAAAAAAAAJ0bwAAAAAAEA==",
        "AAAABAAAAAAAAAAAAAAADEludm9pY2VFcnJvcgAAABgAAAAAAAAAD0ludm9pY2VOb3RGb3VuZAAAAAPpAAAAAAAAABRJbnZvaWNlQWxyZWFkeUV4aXN0cwAAA+oAAAAAAAAAFkludm9pY2VOb3RBY2tub3dsZWRnZWQAAAAAA+sAAAAAAAAAFUludm9pY2VBbHJlYWR5RGVsZXRlZAAAAAAAA+wAAAAAAAAAE0ludm9pY2VBY2tub3dsZWRnZWQAAAAH0QAAAAAAAAAPSW52b2ljZUZpbmFuY2VkAAAAB9IAAAAAAAAAC0ludm9pY2VQYWlkAAAAB9MAAAAAAAAAD0ludm9pY2VSZWplY3RlZAAAAAfUAAAAAAAAAA1JbnZvaWNlVm9pZGVkAAAAAAAH1QAAAAAAAAAXSW52b2ljZVBheW1lbnRDb25maXJtZWQAAAAH1gAAAAAAAAATSW52YWxpZEludm9pY2VJbnB1dAAAAAu5AAAAAAAAAA5JbnZhbGlkTW9uZ29JZAAAAAALugAAAAAAAAANSW52YWxpZEFjdGlvbgAAAAAAC7sAAAAAAAAADkludmFsaWRUeG5IYXNoAAAAAAu8AAAAAAAAABBJbnZhbGlkRmluYW5jZUlkAAALvQAAAAAAAAASSW52YWxpZFZlbmRvckVtYWlsAAAAAAu+AAAAAAAAABJJbnZhbGlkQ2xpZW50RW1haWwAAAAAC78AAAAAAAAAE0ludmFsaWRWZW5kb3JNb2JpbGUAAAALwAAAAAAAAAATSW52YWxpZENsaWVudE1vYmlsZQAAAAvBAAAAAAAAAA9JbnZhbGlkQ3VycmVuY3kAAAALwgAAAAAAAAAUSW52YWxpZEZ1bmRSZWNlcHRpb24AAAvDAAAAAAAAAAxJbnZhbGlkTGluZXMAAAvEAAAAAAAAABBJbnZhbGlkTmV0QW1vdW50AAALxQAAAAAAAAAOSW52YWxpZER1ZURhdGUAAAAAC8Y=",
        "AAAAAQAAAAAAAAAAAAAAB0ludm9pY2UAAAAAIAAAAAAAAAADYWNrAAAAAAEAAAAAAAAABmFjdGlvbgAAAAAAEAAAAAAAAAAMY2xpZW50X2VtYWlsAAAAEAAAAAAAAAAMY2xpZW50X2ZuYW1lAAAAEAAAAAAAAAAMY2xpZW50X2xuYW1lAAAAEAAAAAAAAAANY2xpZW50X21vYmlsZQAAAAAAABAAAAAAAAAADWNyZWF0aW9uX2RhdGUAAAAAAAAQAAAAAAAAAAhjdXJyZW5jeQAAABAAAAAAAAAAEGRlbGV0ZWRfY29tbWVudHMAAAAQAAAAAAAAAAhkdWVfZGF0ZQAAABAAAAAAAAAAB2ZpbmFuY2UAAAAAAQAAAAAAAAARZmluYW5jaW5nX2RldGFpbHMAAAAAAAPqAAAAEAAAAAAAAAAOZnVuZF9yZWNlcHRpb24AAAAAABAAAAAAAAAACGludl90eXBlAAAAEAAAAAAAAAAFbGluZXMAAAAAAAAQAAAAAAAAAAhtb25nb19pZAAAABAAAAAAAAAAB25ldF9hbXQAAAAAEAAAAAAAAAAEcGFpZAAAAAEAAAAAAAAAFHBheW1lbnRfY29uZmlybWF0aW9uAAAAAQAAAAAAAAAVcHJldmlvdXNfaW52b2ljZV9oYXNoAAAAAAAAEAAAAAAAAAAYcmVjZWl2ZWRfaW52b2ljZV9kZWxldGVkAAAAAQAAAAAAAAAIcmVqZWN0ZWQAAAABAAAAAAAAABRzZW50X2ludm9pY2VfZGVsZXRlZAAAAAEAAAAAAAAACHRyYWNraW5nAAAH0AAAAAVUcmFjawAAAAAAAAAAAAAIdHhuX2hhc2gAAAAQAAAAAAAAAAx2ZW5kb3JfZW1haWwAAAAQAAAAAAAAABF2ZW5kb3JfZW1haWxfaGFzaAAAAAAAABAAAAAAAAAACXZlbmRvcl9pZAAAAAAAABAAAAAAAAAADXZlbmRvcl9tb2JpbGUAAAAAAAAQAAAAAAAAABJ2ZW5kb3JfbW9iaWxlX2hhc2gAAAAAABAAAAAAAAAAC3ZlbmRvcl9uYW1lAAAAABAAAAAAAAAABnZvaWRlZAAAAAAAAQ==",
        "AAAAAAAAABhBZGQgb3IgdXBkYXRlIGFuIGludm9pY2UAAAAOY3JlYXRlX2ludm9pY2UAAAAAAAEAAAAAAAAADWludm9pY2VfaW5wdXQAAAAAAAfQAAAAB0ludm9pY2UAAAAAAQAAA+kAAAAQAAAH0AAAAAxJbnZvaWNlRXJyb3I=",
        "AAAAAAAAABZBY2tub3dsZWRnZSBhbiBpbnZvaWNlAAAAAAALYWNrX2ludm9pY2UAAAAAAwAAAAAAAAAIbW9uZ29faWQAAAAQAAAAAAAAAAZhY3Rpb24AAAAAABAAAAAAAAAACHR4bl9oYXNoAAAAEAAAAAEAAAPpAAAAEAAAB9AAAAAMSW52b2ljZUVycm9y",
        "AAAAAAAAAA9QYWlkIGFuIGludm9pY2UAAAAADHBhaWRfaW52b2ljZQAAAAMAAAAAAAAACG1vbmdvX2lkAAAAEAAAAAAAAAAGYWN0aW9uAAAAAAAQAAAAAAAAAAh0eG5faGFzaAAAABAAAAABAAAD6QAAABAAAAfQAAAADEludm9pY2VFcnJvcg==",
        "AAAAAAAAABFSZWplY3QgYW4gaW52b2ljZQAAAAAAAA5yZWplY3RfaW52b2ljZQAAAAAAAwAAAAAAAAAIbW9uZ29faWQAAAAQAAAAAAAAAAZhY3Rpb24AAAAAABAAAAAAAAAACHR4bl9oYXNoAAAAEAAAAAEAAAPpAAAAEAAAB9AAAAAMSW52b2ljZUVycm9y",
        "AAAAAAAAAA9Wb2lkIGFuIGludm9pY2UAAAAADHZvaWRfaW52b2ljZQAAAAMAAAAAAAAACG1vbmdvX2lkAAAAEAAAAAAAAAAGYWN0aW9uAAAAAAAQAAAAAAAAAAh0eG5faGFzaAAAABAAAAABAAAD6QAAABAAAAfQAAAADEludm9pY2VFcnJvcg==",
        "AAAAAAAAABJGaW5hbmNlIGFuIGludm9pY2UAAAAAAA9maW5hbmNlX2ludm9pY2UAAAAABAAAAAAAAAAIbW9uZ29faWQAAAAQAAAAAAAAAApmaW5hbmNlX2lkAAAAAAAQAAAAAAAAAAZhY3Rpb24AAAAAABAAAAAAAAAACHR4bl9oYXNoAAAAEAAAAAEAAAPpAAAAEAAAB9AAAAAMSW52b2ljZUVycm9y",
        "AAAAAAAAAB9QYXltZW50IENvbmZpcm1hdGlvbiBhbiBpbnZvaWNlAAAAABxwYXltZW50X2NvbmZpcm1hdGlvbl9pbnZvaWNlAAAAAwAAAAAAAAAIbW9uZ29faWQAAAAQAAAAAAAAAAZhY3Rpb24AAAAAABAAAAAAAAAACHR4bl9oYXNoAAAAEAAAAAEAAAPpAAAAEAAAB9AAAAAMSW52b2ljZUVycm9y",
        "AAAAAAAAABpVcGRhdGUgVHJhY2tpbmcgYW4gaW52b2ljZQAAAAAAF3VwZGF0ZV9pbnZvaWNlX3RyYWNraW5nAAAAAAcAAAAAAAAACG1vbmdvX2lkAAAAEAAAAAAAAAAHc3ViamVjdAAAAAAQAAAAAAAAAAZzdGF0dXMAAAAAABAAAAAAAAAABm1zZ19pZAAAAAAAEAAAAAAAAAAKYXBpX2tleV9pZAAAAAAAEAAAAAAAAAAFZXZlbnQAAAAAAAAQAAAAAAAAAAJ0bwAAAAAAEAAAAAEAAAPpAAAAEAAAB9AAAAAMSW52b2ljZUVycm9y",
        "AAAAAAAAABVSZXRyaWV2ZSBpbnZvaWNlIGRhdGEAAAAAAAANcXVlcnlfaW52b2ljZQAAAAAAAAEAAAAAAAAACG1vbmdvX2lkAAAAEAAAAAEAAAPoAAAH0AAAAAdJbnZvaWNlAA==",
        "AAAAAAAAAAAAAAAScXVlcnlfYWxsX2ludm9pY2VzAAAAAAAAAAAAAQAAA+oAAAfQAAAAB0ludm9pY2UA",
        "AAAAAAAAAAAAAAAVcXVlcnlfaW52b2ljZV9oaXN0b3J5AAAAAAAAAQAAAAAAAAAIbW9uZ29faWQAAAAQAAAAAQAAA+oAAAfQAAAAB0ludm9pY2UA",
        "AAAAAAAAAAAAAAAQcXVlcnlfYnlfdHhuaGFzaAAAAAEAAAAAAAAACHR4bl9oYXNoAAAAEAAAAAEAAAPqAAAH0AAAAAdJbnZvaWNlAA==",
        "AAAAAAAAAAAAAAAZcXVlcnlfYnlfdmVuZG9yX2VtYWlsaGFzaAAAAAAAAAEAAAAAAAAACmVtYWlsX2hhc2gAAAAAABAAAAABAAAD6gAAB9AAAAAHSW52b2ljZQA=",
        "AAAAAAAAAAAAAAAacXVlcnlfYnlfdmVuZG9yX21vYmlsZWhhc2gAAAAAAAEAAAAAAAAAC21vYmlsZV9oYXNoAAAAABAAAAABAAAD6gAAB9AAAAAHSW52b2ljZQA=",
        "AAAAAAAAAAAAAAAZcXVlcnlfdG90YWxfaW52b2ljZV9jb3VudAAAAAAAAAAAAAABAAAABA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    create_invoice: this.txFromJSON<Result<string>>,
        ack_invoice: this.txFromJSON<Result<string>>,
        paid_invoice: this.txFromJSON<Result<string>>,
        reject_invoice: this.txFromJSON<Result<string>>,
        void_invoice: this.txFromJSON<Result<string>>,
        finance_invoice: this.txFromJSON<Result<string>>,
        payment_confirmation_invoice: this.txFromJSON<Result<string>>,
        update_invoice_tracking: this.txFromJSON<Result<string>>,
        query_invoice: this.txFromJSON<Option<Invoice>>,
        query_all_invoices: this.txFromJSON<Array<Invoice>>,
        query_invoice_history: this.txFromJSON<Array<Invoice>>,
        query_by_txnhash: this.txFromJSON<Array<Invoice>>,
        query_by_vendor_emailhash: this.txFromJSON<Array<Invoice>>,
        query_by_vendor_mobilehash: this.txFromJSON<Array<Invoice>>,
        query_total_invoice_count: this.txFromJSON<u32>
  }
}
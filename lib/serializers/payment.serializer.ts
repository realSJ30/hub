export function serializePayment(payment: any) {
  return {
    id: payment.id,
    bookingId: payment.bookingId,
    amount: Number(payment.amount),
    method: payment.method as string,
    referenceNumber: payment.referenceNumber ?? null,
    paidDate: payment.paidDate instanceof Date
      ? payment.paidDate.toISOString()
      : payment.paidDate,
    notes: payment.notes ?? null,
    createdAt: payment.createdAt instanceof Date
      ? payment.createdAt.toISOString()
      : payment.createdAt,
    updatedAt: payment.updatedAt instanceof Date
      ? payment.updatedAt.toISOString()
      : payment.updatedAt,
  };
}

export function serializePayments(payments: any[]) {
  return payments.map(serializePayment);
}

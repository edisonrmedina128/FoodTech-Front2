import { useState } from 'react';
import { useCompletedOrders } from '../../hooks/useCompletedOrders';
import { CompletedOrdersButton } from './CompletedOrdersButton';
import { CompletedOrdersModal } from './CompletedOrdersModal';
import { useToast } from '../../contexts/ToastContext';

export const CompletedOrdersWidget = () => {
  const {
    completedOrders,
    count,
    loading,
    error,
    requestInvoice,
    invoiceLoadingById,
    invoiceErrorById,
  } = useCompletedOrders();
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  // cleanup ref no longer needed — toast context handles it

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  const handleInvoice = async (orderId: number, customerName: string) => {
    const remainingCount = await requestInvoice(orderId, customerName);
    toast.info('Solicitud de factura enviada — se procesará en breve');
    if (remainingCount === 0) setIsOpen(false);
    return remainingCount;
  };

  return (
    <>
      <CompletedOrdersButton count={count} onToggle={handleToggle} isLoading={loading} />
      {isOpen && (
        <CompletedOrdersModal
          isOpen={isOpen}
          onClose={handleClose}
          orders={completedOrders}
          onInvoice={handleInvoice}
          loading={loading}
          error={error}
          invoiceLoadingById={invoiceLoadingById}
          invoiceErrorById={invoiceErrorById}
        />
      )}
    </>
  );
};

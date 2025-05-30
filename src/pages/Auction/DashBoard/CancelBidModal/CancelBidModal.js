import { useState } from 'react';
import {
  Modal,
  ModalBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CancelBidModal = ({ isOpen, toggle, bidNo, onCancelBid }) => {
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancelBid = async () => {
    if (!remark.trim()) {
      toast.error("Please enter a remark before cancelling the bid");
      return;
    }

    setIsSubmitting(true);

    try {
      const toastId = toast.loading("Cancelling bid...");
      const result = await onCancelBid(bidNo, remark);

      toast.update(toastId, {
        render: result.message || `Bid ${bidNo} cancelled successfully`,
        type: result.success ? "success" : "error",
        isLoading: false,
        autoClose: 3000,
        closeButton: true,
      });

      if (result.success) {
        setRemark("");
        toggle();
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        centered
        backdrop="static"
        style={{
          maxWidth: '448px',
          borderRadius: '20px',
        }}
        contentClassName="border-0 shadow"
      >
        <div style={{ padding: '24px', borderRadius: '20px', position: 'relative', backgroundColor: '#fff' }}>
          {/* Custom Black Close Button */}
          <button
            onClick={toggle}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#000',
              cursor: 'pointer',
              lineHeight: '1',
            }}
          >
            &times;
          </button>

          <h5 style={{ fontWeight: '700', marginBottom: '16px' }}>Cancel Bid</h5>
          <hr style={{ marginTop: 0, marginBottom: '24px' }} />

          <ModalBody style={{ padding: 0 }}>
            <Form>
              <FormGroup>
                <Label for="remark" style={{ fontWeight: '600', marginBottom: '8px' }}>
                  Add Remark <span style={{ color: 'red' }}>*</span>
                </Label>
                <Input
                  type="textarea"
                  id="remark"
                  placeholder="Remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={4}
                  style={{
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '14px',
                    resize: 'none',
                    border: '1px solid #ced4da'
                  }}
                />
              </FormGroup>

              <div style={{ textAlign: 'right', marginTop: '24px' }}>
                <Button
                  onClick={handleCancelBid}
                  disabled={isSubmitting || !remark.trim()}
                  style={{
                    backgroundColor: '#405189',
                    borderColor: '#405189',
                    minWidth: '120px',
                    borderRadius: '6px',
                    fontWeight: '500',
                  }}
                >
                  {isSubmitting ? 'Processing...' : 'Cancel Bid'}
                </Button>
              </div>
            </Form>
          </ModalBody>
        </div>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default CancelBidModal;

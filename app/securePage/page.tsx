//test secure page

import ProtectedRoute from '../../components/ProtectedRoute';

const SecurePage = () => {
  return (
    <ProtectedRoute>
      <div>Only logged-in users can see this page.</div>
    </ProtectedRoute>
  );
};

export default SecurePage;

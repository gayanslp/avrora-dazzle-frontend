import UnAuthorized from '../../views/UnAuthorized';

export const metadata = {
  title: 'Access Denied | Avrora Dazzle Textiles',
  description: 'You do not have authorization to access this protected resource.',
};

export default function UnauthorizedPage() {
  return <UnAuthorized />;
}

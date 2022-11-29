import jwt_decode from 'jwt-decode';

const authenticationCheck = async (token: string) => {
  try {
    const decoded: any = jwt_decode(token);
    const accessType = decoded.resource_access['theia-cloud'].roles[0];
    return true;
  } catch (err) {
    return false;
  }
};

export default authenticationCheck;

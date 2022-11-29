import TextField from '@mui/material/TextField';
import { ChangeEvent, useContext, useState } from 'react';
import TheiaButton from '../components/TheiaButton';
import { LoginContext } from '../context/LoginContext';
import jwt_decode from 'jwt-decode';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default function Login() {
  const ip = '172.19.102.244'; //TODO: replace it with minikube ip
  const realmName = 'TheiaCloud';
  const clientId = 'theia-client';
  const grantType = 'password';
  const clientSecret = 'LtgLkXnbzXEMoR9q3BW3bTg95KcYpOyl';
  const url = `https://keycloak.${ip}.nip.io/auth/realms/${realmName}/protocol/openid-connect/token`;

  const { setUserType } = useContext(LoginContext);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const authUser = async () => {
    const bodyToBeSent: any = {
      client_id: clientId,
      grant_type: grantType,
      client_secret: clientSecret,
      scope: 'openid',
      username: username,
      password: password,
    };

    const formBody = Object.keys(bodyToBeSent)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(bodyToBeSent[key]))
      .join('&');

    const response: any = await fetch(url, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: formBody,
    });

    response.body
      .getReader()
      .read()
      .then((data: any) => {
        try {
          const res = JSON.parse(new TextDecoder('utf-8').decode(data.value));
          const accessToken: any = jwt_decode(res.access_token);
          const accessType = accessToken.resource_access['theia-client'].roles[0];
          setUserType(accessType);
          // console.log(accessType);
        } catch (err) {
          console.error(err);
          setIsAlertOpen(true);
        }
      });
  };

  return (
    <div className='flex w-screen h-screen justify-center'>
      {isAlertOpen && (
        <Fade in={isAlertOpen}>
          <Alert
            variant='filled'
            severity='warning'
            className='absolute top-0 right-0'
            onClose={() => {
              setIsAlertOpen(false);
            }}
          >
            Please check user details and try again.
          </Alert>
        </Fade>
      )}

      <div className='w-60 h-fit self-center flex flex-col'>
        <TextField
          id='outlined-basic'
          label='Username'
          variant='outlined'
          className='w-60 mb-4'
          onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setUsername(e.target.value)}
        />
        <TextField
          id='outlined-basic'
          label='Password'
          type='password'
          className='w-60'
          onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPassword(e.target.value)}
        />
        <TheiaButton
          text='Login'
          className='mt-5 self-stretch justify-center'
          onClick={authUser}
        />
      </div>
    </div>
  );
}

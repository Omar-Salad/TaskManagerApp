import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './Home.css';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  function loginUser() {
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential: { user: unknown; }) => {
        console.log('Logged in:', userCredential.user);
        history.push('/TaskPage');
      })
      .catch((error: { message: string; }) => {
        alert('Login failed: ' + error.message);
      });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput
          placeholder="Username"
          onIonChange={(e) => setUsername(e.detail.value!)}
        />
        <IonInput
          placeholder="Password"
          type="password"
          onIonChange={(e) => setPassword(e.detail.value!)}
        />
        <IonButton onClick={loginUser}>Login</IonButton>
        <p>
          New here? <Link to="/register">Register</Link>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default Login;

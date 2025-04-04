import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './Home.css'; // or create Auth.css for styling
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  function isValidEmail(email: string): boolean {
    return /\S+@\S+\.\S+/.test(email);
  }

  function loginUser() {
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!password) {
      alert('Please enter your password.');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        console.log('Logged in:', userCredential.user);
        history.push('/TaskPage');
      })
      .catch((error: Error) => {
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
      <IonContent className="ion-padding login-page">
        <div className="form-container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginUser();
            }}
          >
            <IonInput
              placeholder="Email"
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
            <IonInput
              placeholder="Password"
              type="password"
              onIonChange={(e) => setPassword(e.detail.value!)}
            />
            <IonButton expand="block" type="submit">Login</IonButton>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            New here? <Link to="/register">Register</Link>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

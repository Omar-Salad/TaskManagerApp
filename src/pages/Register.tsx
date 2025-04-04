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
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const history = useHistory();

  // Simple email validation using regex
  function isValidEmail(email: string): boolean {
    return /\S+@\S+\.\S+/.test(email);
  }

  function registerUser() {
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (password !== cpassword) {
      alert("Passwords don't match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => {
        console.log('Registered:', userCredential.user);
        history.push('/login');
      })
      .catch((error: Error) => {
        alert('Registration failed: ' + error.message);
      });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput
          placeholder="Email"
          onIonChange={(e) => setEmail(e.detail.value!)}
        />
        <IonInput
          placeholder="Password"
          type="password"
          onIonChange={(e) => setPassword(e.detail.value!)}
        />
        <IonInput
          placeholder="Confirm Password"
          type="password"
          onIonChange={(e) => setCPassword(e.detail.value!)}
        />
        <IonButton onClick={registerUser}>Register</IonButton>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;

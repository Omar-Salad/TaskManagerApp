import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar , } from '@ionic/react';
import './Home.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [cpassword, setCPassword] = useState('')

  function registerUser() {
    console.log(username, password , cpassword)
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
          placeholder="Username"
          onIonChange={(e: unknown) => setUsername(e.target.value)}
        />
        <IonInput
          placeholder="Password"
          type="password"
          onIonChange={(e: unknown) => setPassword(e.target.value)}
        />
        <IonInput
          placeholder="Confirm Password"
          type="password"
          onIonChange={(e: unknown) => setCPassword(e.target.value)}
        />
        <IonButton onClick={registerUser}>Register</IonButton>
        <p>
  Already have an account? <Link to="/login">Login</Link>
</p>

      </IonContent>
    </IonPage>
  )
}

export default RegisterPage;

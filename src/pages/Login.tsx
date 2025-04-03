import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTitle, IonToolbar , } from '@ionic/react';
import './Home.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function loginUser() {
    console.log(username, password)
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
          placeholder="Username?"
          onIonChange={(e: unknown) => setUsername(e.target.value)}
        />
        <IonInput
          placeholder="Password?"
          type="password"
          onIonChange={(e: unknown) => setPassword(e.target.value)}
        />
        <IonButton onClick={loginUser}>Login</IonButton>
        <p>
  New here <Link to="/register">Register</Link>
</p>

      </IonContent>
    </IonPage>
  )
}

export default Home

import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar ,} from '@ionic/react';
import './Home.css';
import { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [input] = useState<string>('')

  useEffect(() => {
    console.log(input)
  }, [input])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My TaskManagerApp!</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton routerLink="/login">Login</IonButton>
        <IonButton routerLink="/register" color="secondary">
          Register
        </IonButton>
      </IonContent>
    </IonPage>
  )
}

export default Home

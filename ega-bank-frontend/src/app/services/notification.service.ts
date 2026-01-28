import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'transaction' | 'account' | 'client' | 'system' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: any; // Données supplémentaires liées à la notification
  actionUrl?: string; // URL pour rediriger l'utilisateur
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private unreadCount$ = new BehaviorSubject<number>(0);
  private newNotification$ = new Subject<Notification>();

  constructor() {
    // Charger les notifications depuis le localStorage au démarrage
    this.loadNotificationsFromStorage();
  }

  // Observables publics
  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount$.asObservable();
  }

  getNewNotification(): Observable<Notification> {
    return this.newNotification$.asObservable();
  }

  // Ajouter une nouvelle notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notifications$.value;
    const updatedNotifications = [newNotification, ...currentNotifications];
    
    // Limiter à 100 notifications maximum
    if (updatedNotifications.length > 100) {
      updatedNotifications.splice(100);
    }

    this.notifications$.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
    
    // Émettre la nouvelle notification pour les animations/sons
    this.newNotification$.next(newNotification);
  }

  // Marquer une notification comme lue
  markAsRead(notificationId: string): void {
    const notifications = this.notifications$.value.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    
    this.notifications$.next(notifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead(): void {
    const notifications = this.notifications$.value.map(notification => ({
      ...notification,
      read: true
    }));
    
    this.notifications$.next(notifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  // Supprimer une notification
  removeNotification(notificationId: string): void {
    const notifications = this.notifications$.value.filter(
      notification => notification.id !== notificationId
    );
    
    this.notifications$.next(notifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  // Supprimer toutes les notifications
  clearAllNotifications(): void {
    this.notifications$.next([]);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  // Supprimer les notifications anciennes (plus de 7 jours)
  cleanOldNotifications(): void {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const notifications = this.notifications$.value.filter(
      notification => notification.timestamp > sevenDaysAgo
    );
    
    this.notifications$.next(notifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  // Méthodes utilitaires simples pour les messages
  showSuccess(message: string): void {
    this.addNotification({
      type: 'system',
      title: 'Succès',
      message: `✅ ${message}`,
      priority: 'medium'
    });
  }

  showError(message: string): void {
    this.addNotification({
      type: 'error',
      title: 'Erreur',
      message: `❌ ${message}`,
      priority: 'high'
    });
  }

  showWarning(message: string): void {
    this.addNotification({
      type: 'warning',
      title: 'Attention',
      message: `⚠️ ${message}`,
      priority: 'medium'
    });
  }

  showInfo(message: string): void {
    this.addNotification({
      type: 'system',
      title: 'Information',
      message: `ℹ️ ${message}`,
      priority: 'low'
    });
  }

  // Méthodes utilitaires pour créer des notifications spécifiques
  notifyNewTransaction(clientName: string, amount: number, type: string, accountNumber: string): void {
    this.addNotification({
      type: 'transaction',
      title: 'Nouvelle transaction',
      message: `${clientName} a effectué un ${type.toLowerCase()} de ${amount.toLocaleString()} FCFA sur le compte ${accountNumber}`,
      priority: amount > 100000 ? 'high' : 'medium',
      data: { clientName, amount, type, accountNumber },
      actionUrl: '/admin/dashboard'
    });
  }

  notifyNewAccount(clientName: string, accountType: string, accountNumber: string): void {
    this.addNotification({
      type: 'account',
      title: 'Nouveau compte créé',
      message: `Un compte ${accountType} a été créé pour ${clientName} (${accountNumber})`,
      priority: 'medium',
      data: { clientName, accountType, accountNumber },
      actionUrl: '/admin/clients'
    });
  }

  notifyNewClient(clientName: string, email: string): void {
    this.addNotification({
      type: 'client',
      title: 'Nouveau client inscrit',
      message: `${clientName} s'est inscrit avec l'email ${email}`,
      priority: 'medium',
      data: { clientName, email },
      actionUrl: '/admin/clients'
    });
  }

  notifyLargeTransaction(clientName: string, amount: number, type: string): void {
    this.addNotification({
      type: 'warning',
      title: 'Transaction importante',
      message: `⚠️ ${clientName} a effectué un ${type.toLowerCase()} de ${amount.toLocaleString()} FCFA`,
      priority: 'high',
      data: { clientName, amount, type },
      actionUrl: '/admin/dashboard'
    });
  }

  notifySystemError(error: string, details?: string): void {
    this.addNotification({
      type: 'error',
      title: 'Erreur système',
      message: `❌ ${error}`,
      priority: 'urgent',
      data: { error, details },
      actionUrl: '/admin/dashboard'
    });
  }

  notifySystemInfo(message: string): void {
    this.addNotification({
      type: 'system',
      title: 'Information système',
      message: `ℹ️ ${message}`,
      priority: 'low',
      data: { message }
    });
  }

  // Méthodes privées
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notifications$.value.filter(n => !n.read).length;
    this.unreadCount$.next(unreadCount);
  }

  private saveNotificationsToStorage(): void {
    try {
      const notifications = this.notifications$.value;
      localStorage.setItem('ega-bank-notifications', JSON.stringify(notifications));
    } catch (error) {
      console.warn('Impossible de sauvegarder les notifications:', error);
    }
  }

  private loadNotificationsFromStorage(): void {
    try {
      const stored = localStorage.getItem('ega-bank-notifications');
      if (stored) {
        const notifications: Notification[] = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        this.notifications$.next(notifications);
        this.updateUnreadCount();
      }
    } catch (error) {
      console.warn('Impossible de charger les notifications:', error);
    }
  }

  // Obtenir les notifications par type
  getNotificationsByType(type: Notification['type']): Observable<Notification[]> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        observer.next(notifications.filter(n => n.type === type));
      });
    });
  }

  // Obtenir les notifications par priorité
  getNotificationsByPriority(priority: Notification['priority']): Observable<Notification[]> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        observer.next(notifications.filter(n => n.priority === priority));
      });
    });
  }

  // Obtenir les notifications non lues
  getUnreadNotifications(): Observable<Notification[]> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        observer.next(notifications.filter(n => !n.read));
      });
    });
  }
}
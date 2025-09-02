import { type UserType } from './user';

type NotificationType =
  | 'comment'
  | 'like'
  | 'invite'
  | 'generated-object'
  | 'generated-animation';

type NotificationData = {
  comment: {
    target: string;
    text: string;
    user: UserType;
  };
  like: {
    target: string;
  };
  invite: {
    targetName: string;
    onAccept: () => void;
    onDecline: () => void;
  };
  'generated-object': {
    duration: string;
    prompt: string;
  };
  'generated-animation': {
    textureName: string;
    prompt: string;
  };
};

export type NotificationUnion = {
  [K in NotificationType]: {
    type: K;
    id: string | number;
    createdAt: string;
    viewed: boolean;
    data: NotificationData[K];
  };
}[NotificationType];

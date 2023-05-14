import moment from 'moment';
import { ObjectId } from 'mongodb';
import { Role, Tag, User } from '../types';
import { GraphQLError } from 'graphql';
import { Profile } from '@oauth-everything/passport-discord';

export function rethrowAsGqlError(e: any) {
  // TODO: make this better
  if (e instanceof Error) {
    throw new GraphQLError(e.message);
  } else {
    throw new GraphQLError(JSON.stringify(e));
  }
}

export function tagChecker(newT: Tag[], addT: Tag[]): any {
  // TODO: tags are all kinds of weird, clean it up
  if (newT && newT.length && newT.length > 0) {
    return newT
      .map((tag: Tag) => tag._id)
      .concat(addT.map((tag: Tag) => new ObjectId(tag.value)));
  } else {
    return addT.map((tag: Tag) => new ObjectId(tag.value));
  }
}

export function getTime(): number {
  return moment().unix();
}

export function requireRole(user: User, role: Role) {
  if (user.role < role) {
    throw new GraphQLError('User is not authorized to access this function');
  }
}

export function isAuthenticated(req: any, res: any, next: any) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

export function getAvatar(profile: Profile): string {
  if (profile.photos)
  {
    for (const { primary, type, value } of profile.photos)
    {
      if (primary && type === 'avatar')
        return value;
    }
  }
  return "/unknown_avatar.png";
}
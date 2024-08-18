import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { SocialLinks } from 'social-links';
const socialLinks = new SocialLinks();
import validator from "validator"

export function IsValidLinkedinProfileUrl() {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidLinkedinProfileUrl',
      target: object.constructor,
      propertyName: propertyName,
      // constraints: [property],
      options: { message: 'Profile url must be a valid linkedin profile url in format www.linkedin.com/in/' },
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return false;
          else if (!validator.isURL(value.trim())) return false;
          // const [linkedinProfileUrl] = args.constraints;
          // const relatedValue = (args.object as any)[linkedinProfileUrl];
          return socialLinks.isValid('linkedin', value.trim())
        },
      },
    });
  };
}
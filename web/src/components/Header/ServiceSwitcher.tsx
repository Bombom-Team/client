import { ServiceSwitcher as SharedServiceSwitcher } from '@bombom/shared/ui-web';
import textLogo from '#/assets/avif/bombom-text-logo.avif';
import MaeilMailLogo from '#/assets/svg/maeilmail-logo.svg';

const ServiceSwitcher = () => (
  <SharedServiceSwitcher
    activeService="bombom"
    bombomLogo={
      <img src={textLogo} alt="봄봄" style={{ height: 16, width: 'auto' }} />
    }
    maeilmailLogo={<MaeilMailLogo height={18} />}
  />
);

export default ServiceSwitcher;

import { App } from 'vue';
import Navbar from '@/components/Navbar.vue';
import HeaderBar from '@/components/HeadBar.vue';
import BaseForm from '@/components/BaseForm.vue'
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseTextarea from '@/components/BaseTextarea.vue';
import ProgressBar from '@/components/ProgressBar.vue';
import FieldItem from '@/components/FieldItem.vue'
import WizardNav from '@/components/WizardNav.vue';
import WizardStepper from '@/components/WizardStepper.vue';
import HelpMeWriteModal from '@/components/HelpMeWriteModal.vue';
import Toasts from '@/components/Toasts.vue';
import FieldRow from '@/components/FieldRow.vue';

// Register only truly global components
export default function registerGlobalComponents(app: App) {
  // Core primitives
  app.component('Navbar', Navbar);
  app.component('HeaderBar', HeaderBar);
  app.component('BaseForm', BaseForm);
  app.component('BaseButton', BaseButton);
  app.component('BaseInput', BaseInput);
  app.component('BaseSelect', BaseSelect);
  app.component('BaseTextarea', BaseTextarea);
  app.component('Field', FieldRow);

  export default {
    install(app: App) {
      // Core primitives
      app.component('Navbar', Navbar);
      app.component('HeaderBar', HeaderBar);
      app.component('BaseForm', BaseForm);
      app.component('FieldItem', FieldItem);
      app.component('BaseButton', BaseButton);
      app.component('BaseInput', BaseInput);
      app.component('BaseSelect', BaseSelect);
      app.component('BaseTextarea', BaseTextarea);

      // Utilities / Overlays
      app.component('HelpMeWriteModal', HelpMeWriteModal);
      app.component('Toasts', Toasts);
      app.component('ProgressBar', ProgressBar);
      app.component('WizardNav', WizardNav);
      app.component('WizardStepper', WizardStepper);
    }
  }
}

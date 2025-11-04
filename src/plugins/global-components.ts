import { App } from 'vue';
import AppHeader from '@/components/app/AppHeader.vue';
import BaseForm from '@/components/base/BaseForm.vue'
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseSelect from '@/components/base/BaseSelect.vue';
import BaseTextarea from '@/components/base/BaseTextarea.vue';
import ProgressBar from '@/components/global/ProgressBar.vue';
import FieldItem from '@/components/base/BaseFormField.vue'
import WizardNav from '@/components/wizard/actions.vue';
import WizardStepper from '@/components/wizard/stepper.vue';
import WizardContainer from '@/components/wizard/container.vue';
import HelpMeWriteModal from '@/components/global/HelpMeWriteModal.vue';
import Toasts from '@/components/global/Toasts.vue';

export default {
  install(app: App) {
    // Core primitives
    app.component('AppHeader', AppHeader);
    app.component('BaseForm', BaseForm);
    app.component('FieldItem', FieldItem);
    app.component('BaseCard', BaseCard);
    app.component('BaseButton', BaseButton);
    app.component('BaseInput', BaseInput);
    app.component('BaseSelect', BaseSelect);
    app.component('BaseTextarea', BaseTextarea);

    // Wizard / Layout helpers
    app.component('ProgressBar', ProgressBar);
    app.component('WizardNav', WizardNav);
    app.component('WizardContainer', WizardContainer);
    app.component('WizardStepper', WizardStepper);

    // Utilities / Overlays
    app.component('HelpMeWriteModal', HelpMeWriteModal);
    app.component('Toasts', Toasts);
  }
};
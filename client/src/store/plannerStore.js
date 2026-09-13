import { create } from 'zustand';

const initialForm = {
  destinationId: '',
  destinationName: '',
  days: 3,
  startDate: '',
  travelers: 2,
  budgetTier: 'moderate',
  interests: [],
  travelStyle: 'friends',
};

const usePlannerStore = create((set) => ({
  step: 1,
  totalSteps: 7,
  form: { ...initialForm },
  generatedTrip: null,
  isGenerating: false,

  setField(field, value) {
    set((state) => ({ form: { ...state.form, [field]: value } }));
  },
  toggleInterest(interest) {
    set((state) => {
      const has = state.form.interests.includes(interest);
      return {
        form: {
          ...state.form,
          interests: has
            ? state.form.interests.filter((i) => i !== interest)
            : [...state.form.interests, interest],
        },
      };
    });
  },
  nextStep() {
    set((state) => ({ step: Math.min(state.totalSteps, state.step + 1) }));
  },
  prevStep() {
    set((state) => ({ step: Math.max(1, state.step - 1) }));
  },
  goToStep(step) {
    set({ step });
  },
  setGenerating(isGenerating) {
    set({ isGenerating });
  },
  setGeneratedTrip(trip) {
    set({ generatedTrip: trip });
  },
  reset() {
    set({ step: 1, form: { ...initialForm }, generatedTrip: null, isGenerating: false });
  },
}));

export default usePlannerStore;

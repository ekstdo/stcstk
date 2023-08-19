import { writable } from 'svelte/store';
import { Dfa, DfaConstructor, DfaViewModel } from './Models/Type3';

export const models = writable({
	"dfa-1": new DfaViewModel(new DfaConstructor("abc", "qrs", [[1, 2, 0], [1, 0, 2], [0, 2, 0]], 0, [0, 1]), "abcabc")
});

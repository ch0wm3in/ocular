import { generateBudget } from '@store/state/actions/budget.actions.ts';
import { clear, moveInArrays, remove } from '@utils/array/array.ts';
import { uuid } from '@utils/uuid/uuid.ts';
import type { ActionOptions } from '@store/state/actions/action.types.ts';
import type { BudgetGroup, BudgetSection } from '@store/state/types.ts';

export const budgetGroupActions = ({ getBudgetGroup, budgetYear, undoFunctions }: ActionOptions) => ({
  getBudgetGroup: (id: string) => getBudgetGroup(id),

  addBudgetGroup: (target: BudgetSection, name: string, budget?: string) => {
    budgetYear.value[target].push({
      name,
      id: uuid(),
      budgets: budget ? [generateBudget(budget)] : []
    });
  },

  setBudgetGroupName: (id: string, name: string) => {
    const group = getBudgetGroup(id);

    if (group) {
      group.name = name;
      clear(undoFunctions);
    }
  },

  setBudgetGroups: (target: BudgetSection, groups: BudgetGroup[]): void => {
    budgetYear.value[target] = groups;
    clear(undoFunctions);
  },

  toggleBudgetGroupCollapse: (id: string) => {
    const group = getBudgetGroup(id);

    if (group) {
      group.collapsed = !group.collapsed;
    }
  },

  moveBudgetGroup: (id: string, target: string, after?: boolean) => {
    const { income, expenses, savings } = budgetYear.value;
    moveInArrays([income, expenses, savings], id, target, after);
  },

  removeBudgetGroup: (id: string) => {
    const year = budgetYear.value;
    const expenseGroup = remove(year.expenses, (v) => v.id === id);
    const incomeGroup = remove(year.income, (v) => v.id === id);
    const savingsGroup = remove(year.savings, (v) => v.id === id);

    undoFunctions.push(() => {
      if (expenseGroup) {
        year.expenses.push(expenseGroup);
      }
      if (incomeGroup) {
        year.income.push(incomeGroup);
      }
      if (savingsGroup) {
        year.savings.push(savingsGroup);
      }
    });
  }
});

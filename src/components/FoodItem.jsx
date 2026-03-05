function FoodItem({ food, onDelete }) {
return (
<li>
<span>
{food.name} - {food.calories} kcal
</span>
<button type="button" onClick={() => onDelete(food.id)}>Delete</button>
</li>
);
}
export default FoodItem;
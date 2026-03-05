import FoodItem from "./FoodItem";
function FoodList({ foods, onDelete }) {
if (!Array.isArray(foods) || foods.length === 0) {
return <p> No foods added yet.</p>;
}
return (
<ul> 
{foods.map(food => (
<FoodItem
key={food.id}
food={food}
onDelete={onDelete}
/>
))}
</ul>
);
}

export default FoodList;

const getNavBtnClasses = (isActive: boolean) => {
  const bgColorClass = isActive ? "bg-blue-600 dark:bg-blue-600" : "bg-white  dark:bg-neutral-600";
  const textColorClass = isActive ? "text-white dark:text-white" : "text-gray-700 dark:text-white";
  const hoverColorClass = isActive ? "hover:bg-blue-700 dark:hover:bg-blue-700" : "hover:bg-gray-100 dark:hover:bg-neutral-700";
  return { bgColorClass, textColorClass, hoverColorClass };
};

const getHomeAdminBtnClasses = (isActive: boolean) => {
  const bgColorClass = isActive ? "bg-blue-600 dark:bg-blue-600" : "bg-white border border-gray-300 dark:bg-neutral-700";
  const textColorClass = isActive ? "text-white" : "text-gray-700 dark:text-white";
  const hoverColorClass = isActive ? "hover:bg-blue-700 dark:hover:bg-blue-700" : "hover:bg-gray-50 dark:hover:bg-neutral-600";
  return { bgColorClass, textColorClass, hoverColorClass };
};

export { getNavBtnClasses, getHomeAdminBtnClasses };




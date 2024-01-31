import {useState} from "react";
import {useStore} from '@nanostores/react';
import { TbChevronUp, TbChevronDown, TbX } from "react-icons/tb";

import { isFilterMenuVisible } from './stores/filterStore.js';
import { selectedTags, handleTagSelection } from "./stores/tagsStore.js";
import { capitalizeTag } from "../../utils/tagManipulation.js";

export default function FilterMenu({uniqueTags}){
  const $isFilterMenuVisible = useStore(isFilterMenuVisible)
  const $selectedTags  = useStore(selectedTags)

  const [categoryVisibility, setCategoryVisibility] = useState(() => {
    const initialVisibility = {};
    Object.keys(uniqueTags).forEach((key) => {
      initialVisibility[key] = true;
    });
    return initialVisibility;
  });

  const toggleCategoryVisibility = (categoryKey) => {
    setCategoryVisibility((prevVisibility) => ({
      ...prevVisibility,
      [categoryKey]: !prevVisibility[categoryKey],
    }));
  };

  return (
    <div className={`${$isFilterMenuVisible ? 'flex translate-x-0' : 'translate-x-full'} z-50 md:z-auto fixed md:static top-0 right-0 md:translate-x-0 transition-transform duration-500 md:col-start-1 col-span-1 w-full max-h-screen md:max-h-full flex-col p-4 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 border-2 rounded-lg`}>
      <button
        className="md:hidden self-end m-2 btn-tertiary"
        onClick={() => isFilterMenuVisible.set(!$isFilterMenuVisible)}
      >
        <TbX/>
      </button>
      <div className="overflow-y-scroll md:overflow-hidden p-2"> 
        {Object.keys(uniqueTags).map(key => (
          <div 
            className='mb-4'
            key={`tagCategory-${key}`}
          >
            <h3 
                className='cursor-pointer font-bold border-b-2 flex items-center justify-between py-2'
                onClick={() => toggleCategoryVisibility(key)}
            >
                {key.toUpperCase()}
                {categoryVisibility[key] ? 
                  <TbChevronUp/> :
                  <TbChevronDown/>
                }
            </h3>
            <ul 
              className={`flex flex-col flex-nowrap ${!categoryVisibility[key] && "hidden"}`}
            >
              {uniqueTags[key].map(individualTag => {
                const normalizedTag = capitalizeTag(individualTag)
                return (
                <li
                    key={individualTag}
                    className={`cursor-pointer ml-2 my-1 self-start ${$selectedTags.includes(normalizedTag) ? 'selected' : ''}`}
                    onClick={() => handleTagSelection(normalizedTag)}
                >
                    {normalizedTag}
                </li>
              )})}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="flex self-center gap-4 py-4">
      <button 
          className="btn-primary md:hidden"
          onClick={() => isFilterMenuVisible.set(!$isFilterMenuVisible)}
        >
            View projects
        </button>
        <button 
          className="btn"
          onClick={()=>selectedTags.set([])}
        >
             Reset filters
        </button>
        
      </div>
      
    </div>
  )
  

}
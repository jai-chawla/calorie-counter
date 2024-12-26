/* From Uiverse.io by devAaus */ 

import React from 'react'

const Loader = () => {
  return (
    <div class="flex-col gap-4 w-full flex items-center justify-center">
  <div
    class="w-10 h-10 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
  >
    <div
      class="w-8 h-8 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
    ></div>
  </div>
</div>
  )
}

export default Loader
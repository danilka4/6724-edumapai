import React, {useRef, useEffect} from "react";
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "./0f203da9fadaee30/0f203da9fadaee30@737";

function Example() {
  const ref = useRef();

  useEffect(() => {
    const runtime = new Runtime();
    runtime.module(define, name => {
      if (name === "chart") {
        return new Inspector(ref.current);
      }
    });
    return () => runtime.dispose();
  }, []);

  return (
    <div className="Graph">
      <div ref={ref}></div>
    </div>
  );
}

export default Example;

// import React, { useRef, useEffect } from 'react';
// import { Runtime, Inspector } from '@observablehq/runtime';
// import define from './0f203da9fadaee30/0f203da9fadaee30@540';
// import {
//   Center,
//   Box,
//   Menu,
//   MenuButton,
//   Button,
//   MenuList,
//   MenuItem,
//   ChakraProvider,
//   Divider,
//   Heading,
//   VStack,
// } from '@chakra-ui/react';
// import { ChevronDownIcon } from '@chakra-ui/icons';

// function Example() {
//   const ref = useRef();

//   useEffect(() => {
//     const runtime = new Runtime();
//     runtime.module(define, (name) => {
//       if (name === 'chart') {
//         return new Inspector(ref.current);
//       }
//     });
//     return () => runtime.dispose();
//   }, []);

//   return (
//     <ChakraProvider>
//       <VStack>
//         <Box w="100%" p={4} bg="gray.100">
//           <Heading size="md">My Observable Graph</Heading>
//           <Menu>
//             <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
//               Options
//             </MenuButton>
//             <MenuList>
//               <MenuItem>Option 1</MenuItem>
//               <MenuItem>Option 2</MenuItem>
//               <MenuItem>Option 3</MenuItem>
//             </MenuList>
//           </Menu>
//           <Divider orientation="horizontal" />
//         </Box>
//         <Center flex="1" p={4}>
//           <Box ref={ref} w="100%" h="100%" bg="white" />
//         </Center>
//       </VStack>
//     </ChakraProvider>
//   );
// }

// export default Example;

// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createBuzz } from '../api/buzz';
import BuzzForm from './BuzzForm';
// import { v4 as uuidv4 } from 'uuid';
import { BuzzNewForm } from '../types';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay-ts';
// import dayjs from 'dayjs';
import { buzzEntityAtom } from '../store/buzz';
import { useAtomValue } from 'jotai';
import { connectedAtom } from '../store/user';
import { isNil } from 'ramda';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const AddBuzz = () => {
  const buzzEntity = useAtomValue(buzzEntityAtom);
  const connected = useAtomValue(connectedAtom);
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();

  const handleAddBuzz = async (buzz: BuzzNewForm) => {
    if (!connected) {
      toast.warn('Please connect your wallet to add a buzz...');
      return;
    }
    setIsAdding(true);
    // await sleep(800);
    const createRes = await buzzEntity?.create({ body: buzz.content });
    if (!isNil(createRes?.revealTxIds[0])) {
      queryClient.invalidateQueries({ queryKey: ['buzzes'] });
      toast.success('create buzz successfully');
      setIsAdding(false);
    }
  };

  return (
    <LoadingOverlay active={isAdding} spinner text='Buzz is Creating...'>
      <BuzzForm
        onSubmit={handleAddBuzz}
        initialValue={{ content: '', createTime: '' }}
      />{' '}
    </LoadingOverlay>
  );
};

export default AddBuzz;

// const AddBuzz = () => {
// 	const queryClient = useQueryClient();

// 	const createBuzzMutation = useMutation({
// 		mutationFn: createBuzz,
// 		onSuccess: async () => {
// 			await queryClient.invalidateQueries({ queryKey: ["buzzes"] });
// 			toast.success("create buzz success!");
// 			const doc_modal = document.getElementById("new_buzz_modal") as HTMLDialogElement;
// 			doc_modal.close();
// 		},
// 	});

// 	const handleAddBuzz = (buzz: BuzzNewForm) => {
// 		const id = uuidv4();
// 		createBuzzMutation.mutate({
// 			...buzz,
// 			id,
// 			createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
// 			user: "vae",
// 			isFollowed: false,
// 			txid: id,
// 		});
// 	};

// 	return (
// 		<LoadingOverlay active={createBuzzMutation.isPending} spinner text="Buzz is Creating...">
// 			<BuzzForm onSubmit={handleAddBuzz} initialValue={{ content: "", createTime: "" }} />{" "}
// 		</LoadingOverlay>
// 	);
// };

// export default AddBuzz;

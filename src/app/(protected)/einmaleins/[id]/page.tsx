type EinmaleinsDetailType = {
  id: string;
};

const EinmaleinsDetail = async ({ params }: { params: Promise<EinmaleinsDetailType> }) => {
  const { id } = await params;

  return (
    <div>Einmaleins Detail: {id}</div>
  )
}

export default EinmaleinsDetail
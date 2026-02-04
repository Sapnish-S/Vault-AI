from prompt_toolkit.search import start_search
class ChunkingService:
    def __init__(self, chunk_size=1000, chunk_overlap=200):
        self.chunk_size= chunk_size
        self.chunk_overlap=chunk_overlap
    def create_chunks(self, text:str)-> list[str]:
        chunks=[]
        text= " ".join(text.split())
        start=0
        while start< len(text):
            #We need to determine where this chunk ends
            end= start+self.chunk_size
            #Logic to find a break point
            if end < len(text):
                '''If we are not at the very end of the text we will look for a break
                 We will search backward for a period within the overlap range'''
                breakpoint= -1
                delimiters= [".","?","!"]
                for char in delimiters:
                    # rfind() is reverse find so it will start from end to (end-self.chunk_overlap)
                    position= text.rfind(char, end-self.chunk_overlap, end)
                    if position> breakpoint:
                        breakpoint= position
                if breakpoint==-1:
                    breakpoint= text.rfind(" ", end-self.chunk_overlap, end)
                if breakpoint!=-1:
                    end= breakpoint+1
            chunk=text[start:end]
            #using strip() returns a copy of string with leading or trailing whitespace removed.
            chunks.append(chunk.strip())

            # Now we have to update the start for the next window
            # We want to move to end - overlap, but Must move forward
            next_start= max((end-self.chunk_overlap), start)
            # If we are in middle of a word, we have to find the first space to stat cleanly
            if start< next_start < end:
                word_break= text.rfind(" ", 0,next_start)
                if word_break !=-1 and (word_break + 1) > start:
                    # the next_start point would be just next to that space.
                    next_start= word_break+1
            start= max(next_start, start+1)
        return chunks
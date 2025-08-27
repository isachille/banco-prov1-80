-- Create edge function to process proposal approval/rejection
CREATE OR REPLACE FUNCTION process_proposal_decision(
    proposal_id UUID,
    decision TEXT, -- 'aprovado' or 'recusado'
    admin_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    -- Validate decision
    IF decision NOT IN ('aprovado', 'recusado') THEN
        RETURN json_build_object('error', 'Decisão deve ser aprovado ou recusado');
    END IF;
    
    -- Update proposal status
    UPDATE propostas_financiamento
    SET 
        status = decision,
        updated_at = NOW(),
        admin_id = admin_user_id
    WHERE id = proposal_id;
    
    -- Check if update was successful
    IF NOT FOUND THEN
        RETURN json_build_object('error', 'Proposta não encontrada');
    END IF;
    
    RETURN json_build_object('success', true, 'status', decision);
END;
$$;
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("W2SkmG6zjDjEKvrwzYwct7KuhFcvqVr1GDvYwAjaFnY");

#[program]
pub mod programs_shadowmarket {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }
}
